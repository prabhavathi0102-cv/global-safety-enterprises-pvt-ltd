import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/Section";
import { listPayments, exportPaymentsCsv } from "@/lib/payments.functions";
import { Loader2, Download, Search, LogOut, IndianRupee, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Payments Dashboard — Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Dashboard,
});

type PaymentRow = {
  id: string; invoice_no: string | null; created_at: string; status: string;
  amount_paise: number; customer_name: string; company_name: string | null;
  email: string; phone: string; product: string | null; razorpay_order_id: string | null;
  razorpay_payment_id: string | null; error_reason: string | null;
};

function Dashboard() {
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PaymentRow[]>([]);
  const [totals, setTotals] = useState({ totalPaidPaise: 0, paid: 0, failed: 0, created: 0 });
  const [loading, setLoading] = useState(true);
  const list = useServerFn(listPayments);
  const exportFn = useServerFn(exportPaymentsCsv);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        nav({ to: "/admin/login" });
      } else setReady(true);
    });
  }, [nav]);

  async function load(q = "") {
    setLoading(true);
    try {
      const r = await list({ data: { search: q, limit: 500 } });
      setRows(r.rows as PaymentRow[]);
      setTotals(r.totals);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (ready) load(""); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const cards = useMemo(() => [
    { label: "Total Paid", value: `₹ ${(totals.totalPaidPaise / 100).toLocaleString("en-IN")}`, icon: IndianRupee, tone: "text-primary" },
    { label: "Successful", value: totals.paid, icon: CheckCircle2, tone: "text-emerald-600" },
    { label: "Failed", value: totals.failed, icon: XCircle, tone: "text-destructive" },
    { label: "Pending", value: totals.created, icon: Clock, tone: "text-amber-600" },
  ], [totals]);

  async function doExport() {
    try {
      const { csv } = await exportFn({ data: undefined as unknown as Record<string, never> });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `payments-${Date.now()}.csv`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/admin/login" });
  }

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div>
      <PageHero title="Payments Dashboard" subtitle="Razorpay transactions, search and export." />
      <section className="py-12">
        <div className="container mx-auto px-4 space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</span>
                  <c.icon className={`h-5 w-5 ${c.tone}`} />
                </div>
                <div className="mt-2 text-2xl font-display font-bold">{c.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card">
            <div className="p-4 flex flex-wrap gap-3 items-center justify-between border-b border-border">
              <form onSubmit={(e) => { e.preventDefault(); load(search); }} className="flex gap-2 items-center flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by customer name…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <button type="submit" className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:border-primary hover:text-primary">Search</button>
              </form>
              <div className="flex gap-2">
                <button onClick={doExport} className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold hover:bg-primary/90"><Download className="h-4 w-4" /> Export CSV</button>
                <button onClick={signOut} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:border-destructive hover:text-destructive"><LogOut className="h-4 w-4" /> Sign out</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="p-3">Invoice</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Email / Phone</th>
                    <th className="p-3">Product</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="h-5 w-5 animate-spin inline" /></td></tr>
                  )}
                  {!loading && rows.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No payments yet.</td></tr>
                  )}
                  {!loading && rows.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                      <td className="p-3 font-mono text-xs">{r.invoice_no}</td>
                      <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-IN")}</td>
                      <td className="p-3"><div className="font-semibold">{r.customer_name}</div><div className="text-xs text-muted-foreground">{r.company_name}</div></td>
                      <td className="p-3"><div>{r.email}</div><div className="text-xs text-muted-foreground">{r.phone}</div></td>
                      <td className="p-3 max-w-[200px] truncate" title={r.product ?? ""}>{r.product}</td>
                      <td className="p-3 text-right font-semibold">₹ {(r.amount_paise / 100).toLocaleString("en-IN")}</td>
                      <td className="p-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
    created: "bg-amber-100 text-amber-700",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}