import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EnquirySchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  companyName: z.string().trim().max(150).optional().default(""),
  mobile: z.string().trim().regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone"),
  email: z.string().trim().email().max(255),
  productInterested: z.string().trim().max(100).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(2000).optional().default(""),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EnquirySchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!url) throw new Error("Webhook not configured");

    const payload = {
      timestamp: new Date().toISOString(),
      ...data,
      // Aliases so Apps Scripts using either naming convention work
      name: data.customerName,
      customer_name: data.customerName,
      customerName: data.customerName,
      company: data.companyName,
      company_name: data.companyName,
      companyName: data.companyName,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    if (!res.ok) {
      throw new Error(`Sheet save failed (${res.status})`);
    }
    return { ok: true };
  });