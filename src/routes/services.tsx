import { createFileRoute } from "@tanstack/react-router";
import { Wrench, Shield, ClipboardCheck, AlertTriangle, Calendar, FileSearch, MapPin, Lightbulb, BookOpen, Building, DoorOpen, Siren } from "lucide-react";
import { PageHero, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Installation, AMC & Fire Safety Consultation" },
      { name: "description", content: "Installation, AMC, preventive maintenance, fire safety audit, site inspection and compliance guidance for industrial & commercial projects." },
    ],
  }),
  component: ServicesPage,
});

const groups = [
  {
    title: "Installation Services",
    icon: Wrench,
    items: [
      { icon: Siren, label: "Fire Alarm Installation" },
      { icon: Building, label: "Hydrant Installation" },
      { icon: Shield, label: "PA System Installation" },
      { icon: DoorOpen, label: "Fire Door Installation" },
    ],
  },
  {
    title: "Maintenance Services",
    icon: Calendar,
    items: [
      { icon: ClipboardCheck, label: "AMC Contracts" },
      { icon: Wrench, label: "Preventive Maintenance" },
      { icon: AlertTriangle, label: "Emergency Repairs" },
      { icon: FileSearch, label: "Annual Inspections" },
    ],
  },
  {
    title: "Consultation",
    icon: Lightbulb,
    items: [
      { icon: Shield, label: "Fire Safety Audit" },
      { icon: MapPin, label: "Site Inspection" },
      { icon: Lightbulb, label: "Product Recommendation" },
      { icon: BookOpen, label: "Compliance Guidance" },
    ],
  },
];

function ServicesPage() {
  return (
    <div>
      <PageHero title="Services" subtitle="Turnkey installation, scheduled maintenance and expert consultation — all under one roof." />
      <section className="py-20">
        <div className="container mx-auto px-4 space-y-14">
          {groups.map((g, gi) => (
            <div key={g.title}>
              <SectionHeader eyebrow={`0${gi + 1}`} title={g.title} center={false} />
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {g.items.map((it, i) => (
                  <div key={it.label} className="group rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-smooth animate-float-up" style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="h-12 w-12 rounded-xl bg-fire-gradient text-accent-foreground flex items-center justify-center shadow-fire mb-4 group-hover:scale-110 transition-smooth">
                      <it.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-display font-semibold text-primary">{it.label}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}