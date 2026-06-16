import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/distributors", label: "Distributors" },
  { to: "/payment", label: "Pay" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="bg-primary-deep text-primary-foreground text-xs">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <span className="hidden sm:inline">FSAI Corporate Member • Authorized Distributor across India</span>
          <a href="tel:+919841781060" className="inline-flex items-center gap-2 font-medium hover:text-accent-glow transition-smooth">
            <Phone className="h-3.5 w-3.5" /> +91 98417 81060
          </a>
        </div>
      </div>
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Global Safety Enterprises logo" width={48} height={48} className="h-12 w-12 transition-smooth group-hover:scale-105" />
          <div className="leading-tight">
            <div className="font-display font-bold text-primary text-lg sm:text-xl">Global Safety</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Enterprises (P) Ltd</div>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-secondary transition-smooth"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary bg-secondary rounded-md" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 inline-flex items-center justify-center rounded-md bg-fire-gradient px-4 py-2 text-sm font-semibold text-accent-foreground shadow-fire hover:scale-[1.03] transition-smooth"
          >
            Get Quote
          </Link>
        </nav>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md text-primary hover:bg-secondary"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-foreground/80 hover:bg-secondary hover:text-primary font-medium"
                activeProps={{ className: "px-3 py-2.5 rounded-md bg-secondary text-primary font-semibold" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-fire-gradient px-4 py-2.5 text-sm font-semibold text-accent-foreground"
            >
              Get Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}