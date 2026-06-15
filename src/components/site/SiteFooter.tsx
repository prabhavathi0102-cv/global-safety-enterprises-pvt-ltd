import { Link } from "@tanstack/react-router";
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="bg-primary-deep text-primary-foreground mt-24">
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" width={44} height={44} className="h-11 w-11" loading="lazy" />
            <div>
              <div className="font-display font-bold text-lg">Global Safety</div>
              <div className="text-xs uppercase tracking-widest opacity-70">Enterprises (P) Ltd</div>
            </div>
          </div>
          <p className="mt-4 text-sm opacity-80 leading-relaxed">
            Protecting lives & properties with trusted fire safety solutions — authorized distributor of leading brands across India.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="h-9 w-9 rounded-full bg-white/10 hover:bg-accent transition-smooth flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-base">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-85">
            {[
              { to: "/about", label: "About Us" },
              { to: "/products", label: "Products" },
              { to: "/services", label: "Services" },
              { to: "/distributors", label: "Distributors" },
              { to: "/payment", label: "Make Payment" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-accent-glow transition-smooth">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-base">Products</h4>
          <ul className="space-y-2 text-sm opacity-85">
            {[
              "Fire Alarm Systems",
              "PA Systems",
              "Fire Extinguishers",
              "Hydrant Systems",
              "Valves",
              "Cables",
              "Fire Doors",
            ].map((p) => (
              <li key={p}><Link to="/products" className="hover:text-accent-glow transition-smooth">{p}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4 text-base">Contact</h4>
          <ul className="space-y-3 text-sm opacity-85">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-glow" /> 295, M.K.N Road, Alandur, Chennai - 600016</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-glow" /> <a href="tel:+919840655558" className="hover:text-accent-glow">+91 98406 55558</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-glow" /> <a href="mailto:info@globalsafetys.in" className="hover:text-accent-glow break-all">info@globalsafetys.in</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5 text-xs opacity-70 flex flex-col sm:flex-row gap-2 justify-between">
          <span>© 2026 Global Safety Enterprises (P) Ltd. All Rights Reserved.</span>
          <span>www.globalsafetys.in</span>
        </div>
      </div>
    </footer>
  );
}