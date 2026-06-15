import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { PageHero, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/distributors")({
  head: () => ({
    meta: [
      { title: "Authorized Distributors — Global Safety Enterprises" },
      { name: "description", content: "Authorized distributor for Ravel, Honeywell, Safety First, Safex, Omex, Lehry, Orbit and ASES Security across India." },
    ],
  }),
  component: DistributorsPage,
});

const rows = [
  { cat: "Fire Alarm", brands: ["Ravel"] },
  { cat: "PA Systems", brands: ["Honeywell"] },
  { cat: "Fire Extinguisher", brands: ["Safety First", "Safex"] },
  { cat: "Hydrant System", brands: ["Omex"] },
  { cat: "Valves", brands: ["Lehry Valves"] },
  { cat: "Cables", brands: ["Orbit Wires & Cables"] },
  { cat: "Fire Doors", brands: ["ASES Security"] },
];

function DistributorsPage() {
  return (
    <div>
      <PageHero title="Authorized Distributors" subtitle="We partner with leading manufacturers to deliver certified, warrantied fire safety products across India." />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Brand Partners" title="Category-wise brand authorizations" />
          <div className="grid md:grid-cols-2 gap-6">
            {rows.map((r, i) => (
              <div key={r.cat} className="rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-smooth animate-float-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">Product Category</div>
                    <h3 className="font-display text-xl text-primary font-semibold mt-1">{r.cat}</h3>
                  </div>
                  <BadgeCheck className="h-8 w-8 text-accent" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.brands.map((b) => (
                    <span key={b} className="inline-flex items-center rounded-full bg-secondary text-primary px-3 py-1 text-xs font-semibold">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}