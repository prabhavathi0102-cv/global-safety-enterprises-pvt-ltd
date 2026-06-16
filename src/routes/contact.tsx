import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, User, Send, CheckCircle2, Globe } from "lucide-react";
import { PageHero } from "@/components/site/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Global Safety Enterprises (P) Ltd" },
      { name: "description", content: "Get in touch with Global Safety Enterprises in Chennai & Tirupur. Call +91 98417 81060 or email info@globalsafetys.in for quotes & support." },
    ],
  }),
  component: ContactPage,
});

const PRODUCT_INTEREST = ["Fire Alarm", "PA System", "Fire Extinguisher", "Hydrant System", "Valves", "Cables", "Fire Door", "AMC / Service"];

function ContactPage() {
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div>
      <PageHero title="Get in touch" subtitle="Talk to our team about quotations, AMC, installation or any fire safety requirement." />

      <section className="py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4"><User className="h-6 w-6" /></div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Managing Director</div>
            <div className="mt-1 font-display text-lg font-semibold text-primary">Prabhavathi Shanmugam</div>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
            <div className="h-12 w-12 rounded-xl bg-fire-gradient text-accent-foreground flex items-center justify-center shadow-fire mb-4"><Phone className="h-6 w-6" /></div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Call</div>
            <a href="tel:+919841781060" className="block mt-1 font-display text-lg font-semibold text-primary hover:text-accent">+91 98417 81060</a>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-4"><Mail className="h-6 w-6" /></div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Email</div>
            <a href="mailto:info@globalsafetys.in" className="block mt-1 font-display text-base font-semibold text-primary hover:text-accent break-all">info@globalsafetys.in</a>
            <a href="mailto:globalsafetyenterprisespvtltd@gmail.com" className="block text-sm text-muted-foreground hover:text-accent break-all">globalsafetyenterprisespvtltd@gmail.com</a>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
          <form onSubmit={submit} className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-card">
            <h3 className="font-display text-2xl font-bold text-primary">Send an enquiry</h3>
            <p className="text-sm text-muted-foreground mt-1">We typically respond within one business day.</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Input label="Name" required />
              <Input label="Company Name" />
              <Input label="Phone Number" type="tel" required />
              <Input label="Email" type="email" required />
              <label className="sm:col-span-2 block">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Product Interested</span>
                <select required className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select a product / service</option>
                  {PRODUCT_INTEREST.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="sm:col-span-2 block">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Message</span>
                <textarea rows={5} required maxLength={1000} placeholder="Tell us about your site, area & requirement..." className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </label>
            </div>
            <button type="submit" className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-fire-gradient py-3.5 font-semibold text-accent-foreground shadow-fire hover:scale-[1.01] transition-smooth">
              <Send className="h-4 w-4" /> Submit Enquiry
            </button>
            {sent && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 text-accent px-3 py-2.5 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Thanks — we'll get back to you shortly.
              </div>
            )}
          </form>

          <div className="space-y-6">
            {[
              { title: "Chennai Office", lines: ["295, M.K.N Road,", "Alandur,", "Chennai - 600016"] },
              { title: "Tirupur Office", lines: ["3/2, Govindarajulu Street,", "Avinashi Road,", "Tirupur - 641602"] },
            ].map((o) => (
              <div key={o.title} className="rounded-2xl bg-card border border-border p-6 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-primary text-lg">{o.title}</h4>
                    <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {o.lines.map((l) => <div key={l}>{l}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-gradient text-primary-foreground p-6 shadow-glow">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5" />
                <span className="font-semibold">www.globalsafetys.in</span>
              </div>
              <p className="mt-2 text-sm opacity-90">For emergency support call our 24×7 line.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      <input type={type} required={required} maxLength={255} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </label>
  );
}