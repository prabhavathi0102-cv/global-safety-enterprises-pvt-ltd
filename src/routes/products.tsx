import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, FileText, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import alarmImg from "@/assets/product-alarm.jpg";
import extImg from "@/assets/product-extinguisher.jpg";
import hydImg from "@/assets/product-hydrant.jpg";
import paImg from "@/assets/product-pa.jpg";
import valveImg from "@/assets/product-valves.jpg";
import cableImg from "@/assets/product-cables.jpg";
import doorImg from "@/assets/product-firedoor.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products Catalogue — Fire & Safety Equipment" },
      { name: "description", content: "Browse our fire safety products: fire alarms, PA, extinguishers, hydrants, valves, cables and fire doors with brand & spec details." },
    ],
  }),
  component: ProductsPage,
});

type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  img: string;
  specs: string[];
};

const PRODUCTS: Product[] = [
  { id: "fa-conv", name: "Conventional Fire Alarm Panel", category: "Fire Alarm", brand: "Ravel", img: alarmImg, specs: ["2 / 4 / 8 zone variants", "Battery backup", "IS/EN 54 compliant"] },
  { id: "fa-addr", name: "Addressable Fire Alarm Panel", category: "Fire Alarm", brand: "Ravel", img: alarmImg, specs: ["Up to 250 devices/loop", "Network ready", "Touch display"] },
  { id: "fa-smk", name: "Optical Smoke Detector", category: "Fire Alarm", brand: "Ravel", img: alarmImg, specs: ["Photoelectric", "Low-profile base", "LED indicator"] },
  { id: "pa-spk", name: "PA Ceiling Speaker", category: "PA Systems", brand: "Honeywell", img: paImg, specs: ["6W / 100V line", "EN 54-24 ready", "Ceiling mount"] },
  { id: "pa-amp", name: "PA Amplifier 240W", category: "PA Systems", brand: "Honeywell", img: paImg, specs: ["Mixer-amplifier", "Mic & line inputs", "Zone outputs"] },
  { id: "ex-abc", name: "ABC Powder Extinguisher", category: "Fire Extinguishers", brand: "Safex", img: extImg, specs: ["4 kg / 6 kg / 9 kg", "Class A/B/C", "BIS marked"] },
  { id: "ex-co2", name: "CO2 Extinguisher", category: "Fire Extinguishers", brand: "Safety First", img: extImg, specs: ["2 kg / 4.5 kg", "Electrical fires", "Non-conductive"] },
  { id: "ex-cln", name: "Clean Agent Extinguisher", category: "Fire Extinguishers", brand: "Safex", img: extImg, specs: ["HFC227ea", "Server room safe", "Residue-free"] },
  { id: "hy-lv", name: "Landing Valve (Single Outlet)", category: "Hydrant Systems", brand: "Omex", img: hydImg, specs: ["63 mm gunmetal", "PN 1.6 MPa", "IS 5290 compliant"] },
  { id: "hy-hr", name: "Hose Reel Drum", category: "Hydrant Systems", brand: "Omex", img: hydImg, specs: ["30 m hose", "Swing arm", "Wall mounted"] },
  { id: "va-bf", name: "Butterfly Valve", category: "Valves", brand: "Lehry", img: valveImg, specs: ["Wafer / lug", "DI body", "PN16"] },
  { id: "va-gt", name: "Gate Valve", category: "Valves", brand: "Lehry", img: valveImg, specs: ["Rising stem", "Flanged ends", "Cast iron"] },
  { id: "cb-fr", name: "Fire-resistant Cable", category: "Cables", brand: "Orbit", img: cableImg, specs: ["FRLS / FR-LSH", "IS 7098 compliant", "Multi-core"] },
  { id: "fd-st", name: "Fire-rated Steel Door", category: "Fire Doors", brand: "ASES Security", img: doorImg, specs: ["60 / 90 / 120 min rating", "Single & double leaf", "Push bar option"] },
];

const CATS = ["All", "Fire Alarm", "PA Systems", "Fire Extinguishers", "Hydrant Systems", "Valves", "Cables", "Fire Doors"];

function ProductsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => (cat === "All" || p.category === cat) && (q === "" || p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase())));
  }, [q, cat]);

  return (
    <div>
      <PageHero title="Product Catalogue" subtitle="Browse our complete fire & safety portfolio. Filter by category, search by name or brand, and request a quotation." />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-card flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products or brands..."
                className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={
                    (cat === c
                      ? "bg-primary text-primary-foreground border-primary "
                      : "bg-background text-foreground/80 hover:text-primary border-border ") +
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-smooth"
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <article key={p.id} className="group rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-smooth animate-float-up" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={p.img} alt={p.name} loading="lazy" width={800} height={600} className="h-full w-full object-cover group-hover:scale-105 transition-smooth duration-700" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-widest font-semibold">
                    <span className="text-accent">{p.brand}</span>
                    <span className="text-muted-foreground">{p.category}</span>
                  </div>
                  <h3 className="mt-1.5 font-display font-semibold text-primary">{p.name}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {p.specs.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-accent flex-shrink-0" /> {s}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex gap-2">
                    <Link to="/contact" className="flex-1 inline-flex items-center justify-center gap-1 rounded-md bg-fire-gradient px-3 py-2 text-xs font-semibold text-accent-foreground shadow-fire hover:scale-[1.02] transition-smooth">
                      <FileText className="h-3.5 w-3.5" /> Request Quote
                    </Link>
                    <button className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground/80 hover:text-primary hover:border-primary transition-smooth">
                      <Download className="h-3.5 w-3.5" /> Brochure
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">No products match your search.</div>
          )}
        </div>
      </section>
    </div>
  );
}