import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Award, Users, Wrench, Zap, Headphones, ArrowRight, CheckCircle2, Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/site/Section";
import hero from "@/assets/hero.jpg";
import alarmImg from "@/assets/product-alarm.jpg";
import extImg from "@/assets/product-extinguisher.jpg";
import hydImg from "@/assets/product-hydrant.jpg";
import paImg from "@/assets/product-pa.jpg";
import valveImg from "@/assets/product-valves.jpg";
import cableImg from "@/assets/product-cables.jpg";
import doorImg from "@/assets/product-firedoor.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Global Safety Enterprises (P) Ltd — Fire & Safety Solutions" },
      { name: "description", content: "Authorized distributor of fire alarm systems, PA systems, fire extinguishers, hydrant systems, valves, cables & fire doors across India. Installation, AMC & 24×7 support." },
      { property: "og:title", content: "Global Safety Enterprises — Trusted Fire Safety Solutions" },
      { property: "og:description", content: "Protecting lives & properties with certified fire safety solutions, installation and AMC support." },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
    ],
  }),
  component: HomePage,
});

const whyUs = [
  { icon: ShieldCheck, title: "Certified Fire Safety Company", text: "FSAI corporate member with full compliance." },
  { icon: Award, title: "Authorized Distributor", text: "Honeywell, Ravel, Safex, Omex, Lehry, Orbit, ASES." },
  { icon: Users, title: "Experienced Technical Team", text: "Trained engineers with field experience." },
  { icon: Wrench, title: "Annual Maintenance Services", text: "End-to-end AMC and preventive contracts." },
  { icon: Zap, title: "Quick Installation & Support", text: "Turnkey deployment with on-time delivery." },
  { icon: Headphones, title: "24×7 Customer Assistance", text: "Always available for emergency support." },
];

const products = [
  { img: alarmImg, title: "Fire Alarm Systems", items: ["Conventional", "Addressable", "Smoke & Heat Detectors", "Manual Call Points"], brand: "Ravel" },
  { img: paImg, title: "PA Systems", items: ["Public Address", "Speakers & Amplifiers", "Voice Evacuation"], brand: "Honeywell" },
  { img: extImg, title: "Fire Extinguishers", items: ["ABC, CO2, Water Mist", "Foam & Clean Agent"], brand: "Safety First, Safex" },
  { img: hydImg, title: "Hydrant Systems", items: ["Hydrant & Landing Valves", "Hose Reels & Pipes", "Sprinkler Systems"], brand: "Omex" },
  { img: valveImg, title: "Valves", items: ["Butterfly", "Gate", "Check"], brand: "Lehry Valves" },
  { img: cableImg, title: "Cables", items: ["Fire-resistant Wires & Cables"], brand: "Orbit Wires & Cables" },
  { img: doorImg, title: "Fire Doors", items: ["Fire-rated Steel Doors", "Emergency Exit Hardware"], brand: "ASES Security" },
];

const testimonials = [
  { name: "Ramesh K.", role: "Facility Manager, IT Park Chennai", text: "Their addressable alarm install was flawless — clean cabling, prompt commissioning and ongoing AMC has been excellent." },
  { name: "Priya S.", role: "Project Engineer, Tirupur Textiles", text: "Quoted, supplied and installed our entire hydrant network on schedule. Highly recommended for industrial fire safety." },
  { name: "Arun M.", role: "Hotel Owner", text: "Switched to Global Safety for our extinguisher AMC — far more responsive and well-priced than our previous vendor." },
];

function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="Industrial fire safety setup with extinguishers, alarm panel and hydrant" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/95 via-primary-deep/80 to-primary-deep/30" />
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-2xl text-primary-foreground animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-5">
              <span className="h-2 w-2 rounded-full bg-accent-glow animate-pulse" /> Trusted since inception
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
              Protecting Lives & Properties with <span className="text-fire-gradient">Trusted Fire Safety</span> Solutions
            </h1>
            <p className="mt-6 text-base sm:text-lg opacity-90 leading-relaxed">
              Authorized distributor of Fire Alarm Systems, PA Systems, Fire Extinguishers, Hydrant Systems, Valves, Cables and Fire Doors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-fire-gradient px-6 py-3 font-semibold text-accent-foreground shadow-fire hover:scale-[1.03] transition-smooth">
                Get Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white/10 backdrop-blur border border-white/20 px-6 py-3 font-semibold text-primary-foreground hover:bg-white/15 transition-smooth">
                Contact Us
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: "7+", l: "Top Brands" },
                { v: "24×7", l: "Support" },
                { v: "100%", l: "Compliance" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-display font-bold text-accent-glow">{s.v}</div>
                  <div className="text-xs uppercase tracking-wider opacity-80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Why Choose Us" title="Built on trust, certified by experience" description="From design and supply to installation and maintenance — we are your single-point partner for fire & life safety." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((w, i) => (
              <div key={w.title} className="group rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-smooth animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-12 w-12 rounded-xl bg-fire-gradient text-accent-foreground flex items-center justify-center shadow-fire mb-4 group-hover:scale-110 transition-smooth">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-20 md:py-24 bg-secondary/40">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Our Products" title="Complete fire & safety product portfolio" description="Authorized distributor of industry-leading brands across all major categories." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <article key={p.title} className="group rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-smooth animate-float-up" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={p.img} alt={p.title} loading="lazy" width={800} height={600} className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-700" />
                </div>
                <div className="p-5">
                  <div className="text-[11px] uppercase tracking-widest text-accent font-semibold">{p.brand}</div>
                  <h3 className="mt-1 font-display font-semibold text-lg text-primary">{p.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0" /> {it}</li>
                    ))}
                  </ul>
                  <Link to="/products" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-smooth">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl bg-brand-gradient text-primary-foreground p-8 md:p-12 grid md:grid-cols-[1fr_auto] items-center gap-6 shadow-glow">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold">Need a fire safety audit or AMC quotation?</h3>
              <p className="mt-2 opacity-90">Our team will assess your site and propose a compliant, cost-effective solution.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-md bg-fire-gradient px-6 py-3 font-semibold text-accent-foreground shadow-fire hover:scale-[1.03] transition-smooth">
              Request a Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="Testimonials" title="What our customers say" />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t.name} className="rounded-2xl bg-card border border-border p-6 shadow-card animate-float-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Quote className="h-6 w-6 text-accent" />
                <p className="mt-3 text-sm text-foreground/85 leading-relaxed">"{t.text}"</p>
                <div className="mt-4 flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="font-semibold text-primary">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}