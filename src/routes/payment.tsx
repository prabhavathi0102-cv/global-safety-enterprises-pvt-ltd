import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  recordPaymentFailure,
} from "@/lib/payments.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Make a Payment — Global Safety Enterprises" },
      { name: "description", content: "Secure online payment via UPI, card or net banking for invoices issued by Global Safety Enterprises (P) Ltd." },
    ],
  }),
  component: PaymentPage,
});

const RZP_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = RZP_SCRIPT;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

type RzpHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

function PaymentPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<
    | { kind: "success"; invoiceNo: string; amountPaise: number }
    | { kind: "failed"; reason?: string }
    | null
  >(null);

  const createOrder = useServerFn(createRazorpayOrder);
  const verifyPayment = useServerFn(verifyRazorpayPayment);
  const failPayment = useServerFn(recordPaymentFailure);

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setBusy(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Could not load payment gateway. Check your connection.");

      const order = await createOrder({
        data: {
          customerName: name,
          companyName: company,
          email,
          phone,
          address,
          product,
          amount: amountNum,
        },
      });

      const Rzp = (window as unknown as { Razorpay: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void } }).Razorpay;
      const rzp = new Rzp({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Global Safety Enterprises (P) Ltd",
        description: product || "Fire & Safety Services",
        prefill: order.prefill,
        notes: { invoice_no: order.invoiceNo },
        theme: { color: "#b91c1c" },
        method: { upi: true, card: true, netbanking: true, wallet: true, emi: false, paylater: false },
        handler: async (resp: RzpHandlerResponse) => {
          try {
            const v = await verifyPayment({ data: resp });
            setResult({ kind: "success", invoiceNo: v.invoiceNo!, amountPaise: v.amountPaise });
          } catch (err) {
            console.error(err);
            setResult({ kind: "failed", reason: "Signature verification failed" });
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: async () => {
            await failPayment({ data: { razorpay_order_id: order.orderId, reason: "Cancelled by user" } });
            setBusy(false);
          },
        },
      });
      rzp.on("payment.failed", async (resp: { error?: { description?: string } }) => {
        await failPayment({ data: { razorpay_order_id: order.orderId, reason: resp.error?.description ?? "Payment failed" } });
        setResult({ kind: "failed", reason: resp.error?.description });
        setBusy(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Could not start payment");
      setBusy(false);
    }
  }

  if (result?.kind === "success") {
    return (
      <div>
        <PageHero title="Payment Received" subtitle="Thank you — a receipt will be emailed shortly." />
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-xl">
            <div className="rounded-2xl bg-card border border-border p-8 shadow-card text-center">
              <div className="h-16 w-16 rounded-full bg-accent/15 text-accent mx-auto flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-primary">Payment Successful</h2>
              <p className="mt-2 text-muted-foreground">Invoice <strong>{result.invoiceNo}</strong> paid by <strong>{name || "—"}</strong></p>
              <div className="mt-6 text-3xl font-display font-bold text-fire-gradient">₹ {(result.amountPaise / 100).toLocaleString("en-IN")}</div>
              <button onClick={() => { setResult(null); setName(""); setCompany(""); setEmail(""); setPhone(""); setAddress(""); setProduct(""); setAmount(""); }} className="mt-8 inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary transition-smooth">
                Make another payment
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (result?.kind === "failed") {
    return (
      <div>
        <PageHero title="Payment Failed" subtitle="Your payment could not be completed." />
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-xl">
            <div className="rounded-2xl bg-card border border-border p-8 shadow-card text-center">
              <h2 className="font-display text-2xl font-bold text-destructive">Payment Failed. Please try again.</h2>
              {result.reason && <p className="mt-2 text-sm text-muted-foreground">{result.reason}</p>}
              <button onClick={() => setResult(null)} className="mt-8 inline-flex items-center justify-center rounded-md bg-fire-gradient px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-fire">
                Try again
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero title="Make a Payment" subtitle="Pay your invoice securely. We support UPI, cards and net banking." />
      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <form onSubmit={pay} className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-card">
            <h3 className="font-display text-xl font-semibold text-primary">Your details</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" value={name} onChange={setName} placeholder="Customer name" required />
              <Field label="Company Name" value={company} onChange={setCompany} placeholder="Company / Organisation" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="you@company.com" type="email" required />
              <Field label="Phone" value={phone} onChange={setPhone} placeholder="+91 9xxxxxxxxx" required />
              <div className="sm:col-span-2">
                <Field label="Address" value={address} onChange={setAddress} placeholder="Billing address" />
              </div>
              <div className="sm:col-span-2">
                <Field label="Product / Service" value={product} onChange={setProduct} placeholder="e.g. Fire Extinguisher refill — 5 nos" />
              </div>
              <Field label="Amount (₹)" value={amount} onChange={setAmount} placeholder="0.00" required type="number" />
            </div>

            <div className="mt-6 rounded-xl bg-secondary/60 p-4 flex gap-3 items-start text-sm">
              <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                You'll be redirected to <strong className="text-primary">Razorpay</strong> to complete payment via UPI, Credit/Debit Card, Net Banking or Wallet. All transactions are encrypted and PCI-DSS compliant.
              </p>
            </div>

            <button type="submit" disabled={busy} className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-md bg-fire-gradient py-3.5 font-semibold text-accent-foreground shadow-fire hover:scale-[1.01] transition-smooth disabled:opacity-60 disabled:hover:scale-100">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {busy ? "Starting secure checkout…" : "Pay Now"}
            </button>
          </form>

          <aside className="rounded-2xl bg-brand-gradient text-primary-foreground p-6 shadow-glow">
            <h4 className="font-display font-semibold">Secure & Encrypted</h4>
            <p className="mt-2 text-sm opacity-90">All transactions are encrypted end-to-end. We never store your full card details on our servers.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Razorpay PCI-DSS gateway", "UPI, Cards, NetBanking, Wallets", "Instant payment confirmation"].map((b) => (
                <li key={b} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent-glow flex-shrink-0 mt-0.5" /> {b}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }: { label: string; value?: string; onChange?: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}