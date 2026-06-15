import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Smartphone, Building2, Lock, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Make a Payment — Global Safety Enterprises" },
      { name: "description", content: "Secure online payment via UPI, card or net banking for invoices issued by Global Safety Enterprises (P) Ltd." },
    ],
  }),
  component: PaymentPage,
});

const METHODS = [
  { id: "upi", label: "UPI / QR", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard },
  { id: "nb", label: "Net Banking", icon: Building2 },
];

function PaymentPage() {
  const [method, setMethod] = useState("upi");
  const [invoice, setInvoice] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  function pay(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  if (done) {
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
              <p className="mt-2 text-muted-foreground">Invoice <strong>{invoice || "—"}</strong> paid by <strong>{name || "—"}</strong></p>
              <div className="mt-6 text-3xl font-display font-bold text-fire-gradient">₹ {Number(amount || 0).toLocaleString("en-IN")}</div>
              <button onClick={() => { setDone(false); setInvoice(""); setName(""); setAmount(""); }} className="mt-8 inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary transition-smooth">
                Make another payment
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
            <h3 className="font-display text-xl font-semibold text-primary">Invoice details</h3>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field label="Invoice Number" value={invoice} onChange={setInvoice} placeholder="INV-2026-0001" required />
              <Field label="Customer Name" value={name} onChange={setName} placeholder="Your company / name" required />
              <Field label="Amount (₹)" value={amount} onChange={setAmount} placeholder="0.00" required type="number" />
              <Field label="Email for receipt" placeholder="you@company.com" type="email" />
            </div>

            <h3 className="mt-8 font-display text-xl font-semibold text-primary">Payment method</h3>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {METHODS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={
                    (method === m.id ? "border-primary bg-primary/5 text-primary " : "border-border hover:border-primary/50 ") +
                    "rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-smooth"
                  }
                >
                  <m.icon className="h-6 w-6" />
                  <span className="text-sm font-semibold">{m.label}</span>
                </button>
              ))}
            </div>

            {method === "upi" && (
              <div className="mt-6 rounded-xl bg-secondary/60 p-5 flex items-center gap-5">
                <div className="h-28 w-28 rounded-lg bg-white p-2 grid grid-cols-8 gap-px shadow">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={(i * 7) % 3 === 0 ? "bg-primary-deep" : "bg-transparent"} />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-primary">Scan UPI QR</div>
                  <div className="text-muted-foreground">Or use UPI ID: <code className="bg-card px-1.5 py-0.5 rounded">globalsafety@upi</code></div>
                </div>
              </div>
            )}

            <button type="submit" className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-md bg-fire-gradient py-3.5 font-semibold text-accent-foreground shadow-fire hover:scale-[1.01] transition-smooth">
              <Lock className="h-4 w-4" /> Pay Now
            </button>
          </form>

          <aside className="rounded-2xl bg-brand-gradient text-primary-foreground p-6 shadow-glow">
            <h4 className="font-display font-semibold">Secure & Encrypted</h4>
            <p className="mt-2 text-sm opacity-90">All transactions are encrypted end-to-end. We never store your full card details on our servers.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {["PCI DSS aligned gateway", "Instant payment confirmation", "GST invoice on email"].map((b) => (
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