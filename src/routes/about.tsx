import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Award, ShieldCheck, BadgeCheck, Building2 } from "lucide-react";
import { PageHero, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Global Safety Enterprises (P) Ltd" },
      { name: "description", content: "Trusted fire safety solutions provider — fire alarms, PA systems, extinguishers, hydrants, fire doors, installation & maintenance services." },
      { property: "og:title", content: "About Global Safety Enterprises" },
      { property: "og:description", content: "Our mission, vision and certifications." },
    ],
  }),
  component: AboutPage,
});

const offerings = [
  "Fire Alarm Systems", "Public Address Systems", "Fire Extinguishers",
  "Hydrant Systems", "Fire Doors", "Safety Equipment", "Installation & Maintenance",
];

const certifications = [
  { icon: Award, title: "FSAI Corporate Member", text: "Fire & Security Association of India" },
  { icon: BadgeCheck, title: "Authorized Distributor", text: "Honeywell, Ravel, Safex, Omex, Lehry, Orbit, ASES" },
  { icon: ShieldCheck, title: "Compliance Certified", text: "BIS & NBC compliant product portfolio" },
];

function AboutPage() {
  return (
    <div>
      <PageHero title="About Global Safety Enterprises" subtitle="A trusted fire safety solutions provider committed to protecting lives and properties with reliable products, quality service and timely support." />

      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeader eyebrow="Our Company" title="Reliable fire safety, end to end" center={false} />
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Global Safety Enterprises (P) Ltd</strong> is a trusted fire safety solutions provider specializing in the supply, installation and maintenance of complete fire & life safety systems for industrial, commercial and residential projects across India.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We are committed to protecting lives and properties by delivering reliable products, quality service and timely support — backed by authorized distributorships from leading global brands.
            </p>
          </div>
          <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"><Building2 className="h-5 w-5" /></div>
              <h3 className="font-display font-semibold text-primary text-lg">What we specialize in</h3>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {offerings.map((o) => (
                <li key={o} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/40">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Mission", text: "To provide world-class fire safety solutions ensuring maximum protection and customer satisfaction." },
            { icon: Eye, title: "Vision", text: "To become one of India's most trusted and preferred fire safety solution providers." },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl bg-card border border-border p-8 shadow-card">
              <div className="h-12 w-12 rounded-xl bg-fire-gradient text-accent-foreground flex items-center justify-center shadow-fire mb-4">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary">{b.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Certifications" title="Certified & authorized" description="We hold corporate memberships and authorized distributorships that back every product and service we deliver." />
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((c) => (
              <div key={c.title} className="rounded-2xl bg-card border border-border p-6 text-center shadow-card hover:shadow-card-hover transition-smooth">
                <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground mx-auto flex items-center justify-center mb-4">
                  <c.icon className="h-7 w-7" />
                </div>
                <h4 className="font-display font-semibold text-primary">{c.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}