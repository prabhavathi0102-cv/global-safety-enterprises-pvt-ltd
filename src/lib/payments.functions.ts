import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "node:crypto";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CustomerSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  companyName: z.string().trim().max(150).optional().default(""),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone"),
  address: z.string().trim().max(500).optional().default(""),
  product: z.string().trim().max(200).optional().default(""),
  amount: z.number().positive().max(10_000_000),
});

function ensureRazorpayCreds() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured");
  return { keyId, keySecret };
}

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CustomerSchema.parse(d))
  .handler(async ({ data }) => {
    const { keyId, keySecret } = ensureRazorpayCreds();
    const amountPaise = Math.round(data.amount * 100);

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: `r_${Date.now()}`,
        notes: { product: data.product || "—", customer: data.customerName },
      }),
    });
    if (!orderRes.ok) {
      const txt = await orderRes.text();
      console.error("Razorpay order error", orderRes.status, txt);
      throw new Error("Could not create payment order");
    }
    const order = (await orderRes.json()) as { id: string; amount: number; currency: string };
    const invoiceNo = `INV-${new Date().getFullYear()}-${order.id.slice(-6).toUpperCase()}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("payments").insert({
      invoice_no: invoiceNo,
      customer_name: data.customerName,
      company_name: data.companyName || null,
      email: data.email,
      phone: data.phone,
      address: data.address || null,
      product: data.product || null,
      amount_paise: amountPaise,
      currency: "INR",
      status: "created",
      razorpay_order_id: order.id,
    });
    if (error) {
      console.error("payments insert", error);
      throw new Error("Failed to record order");
    }

    return {
      orderId: order.id,
      amount: amountPaise,
      currency: "INR",
      keyId,
      invoiceNo,
      prefill: { name: data.customerName, email: data.email, contact: data.phone },
    };
  });

const VerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => VerifySchema.parse(d))
  .handler(async ({ data }) => {
    const { keySecret } = ensureRazorpayCreds();
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");
    const provided = data.razorpay_signature;
    const valid =
      expected.length === provided.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (!valid) {
      await supabaseAdmin
        .from("payments")
        .update({
          status: "failed",
          razorpay_payment_id: data.razorpay_payment_id,
          error_reason: "Invalid signature",
        })
        .eq("razorpay_order_id", data.razorpay_order_id);
      throw new Error("Payment verification failed");
    }

    const { data: row, error } = await supabaseAdmin
      .from("payments")
      .update({
        status: "paid",
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        error_reason: null,
      })
      .eq("razorpay_order_id", data.razorpay_order_id)
      .select()
      .single();
    if (error || !row) {
      console.error("payments update", error);
      throw new Error("Failed to save payment");
    }

    const sheet = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheet) {
      try {
        await fetch(sheet, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            type: "payment",
            invoice_no: row.invoice_no,
            customer_name: row.customer_name,
            company_name: row.company_name,
            email: row.email,
            phone: row.phone,
            address: row.address,
            product: row.product,
            amount_inr: row.amount_paise / 100,
            status: row.status,
            razorpay_order_id: row.razorpay_order_id,
            razorpay_payment_id: row.razorpay_payment_id,
          }),
          redirect: "follow",
        });
      } catch (e) {
        console.error("sheets webhook", e);
      }
    }

    return { ok: true, invoiceNo: row.invoice_no, amountPaise: row.amount_paise };
  });

const FailureSchema = z.object({
  razorpay_order_id: z.string().min(1),
  reason: z.string().max(500).optional().default(""),
});

export const recordPaymentFailure = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => FailureSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("payments")
      .update({ status: "failed", error_reason: data.reason || "Payment cancelled or failed" })
      .eq("razorpay_order_id", data.razorpay_order_id)
      .eq("status", "created");
    return { ok: true };
  });

function requireAdmin(claims: unknown) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const email = ((claims as { email?: string } | null | undefined)?.email ?? "").toLowerCase();
  if (!adminEmail || !email || email !== adminEmail) {
    throw new Error("Forbidden");
  }
}

const ListSchema = z.object({
  search: z.string().trim().max(100).optional().default(""),
  limit: z.number().int().min(1).max(1000).optional().default(200),
});

export const listPayments = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ListSchema.parse(d))
  .handler(async ({ data, context }) => {
    requireAdmin(context.claims);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.search) q = q.ilike("customer_name", `%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw error;

    const totals = { totalPaidPaise: 0, paid: 0, failed: 0, created: 0 };
    for (const r of rows ?? []) {
      if (r.status === "paid") {
        totals.paid++;
        totals.totalPaidPaise += Number(r.amount_paise);
      } else if (r.status === "failed") totals.failed++;
      else totals.created++;
    }
    return { rows: rows ?? [], totals };
  });

export const exportPaymentsCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    requireAdmin(context.claims);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10000);
    if (error) throw error;

    const header = [
      "invoice_no","created_at","status","amount_inr","customer_name","company_name","email","phone","address","product","razorpay_order_id","razorpay_payment_id","error_reason",
    ];
    const esc = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [header.join(",")];
    for (const r of rows ?? []) {
      lines.push([
        r.invoice_no, r.created_at, r.status, (Number(r.amount_paise) / 100).toFixed(2),
        r.customer_name, r.company_name, r.email, r.phone, r.address, r.product,
        r.razorpay_order_id, r.razorpay_payment_id, r.error_reason,
      ].map(esc).join(","));
    }
    return { csv: lines.join("\n"), count: rows?.length ?? 0 };
  });