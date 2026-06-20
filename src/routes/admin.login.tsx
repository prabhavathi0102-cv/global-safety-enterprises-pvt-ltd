import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/Section";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Global Safety Enterprises" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    nav({ to: "/admin/dashboard" });
  }

  return (
    <div>
      <PageHero title="Admin Login" subtitle="Sign in to view payments dashboard." />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <form onSubmit={submit} className="rounded-2xl bg-card border border-border p-8 shadow-card space-y-4">
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Email</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Password</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </label>
            <button disabled={busy} type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-fire-gradient py-3 font-semibold text-accent-foreground shadow-fire disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />} Sign in
            </button>
            <p className="text-xs text-muted-foreground">Only the configured admin email can access the dashboard. Create the admin user from the Lovable Cloud → Users panel first.</p>
          </form>
        </div>
      </section>
    </div>
  );
}