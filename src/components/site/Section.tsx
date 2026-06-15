import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "max-w-2xl mx-auto text-center mb-12" : "max-w-2xl mb-10"}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl font-bold text-primary">{title}</h2>
      {description && <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{description}</p>}
    </div>
  );
}

export function PageHero({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-brand-gradient text-primary-foreground">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,80,80,.35), transparent 45%)" }} />
      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">{title}</h1>
        {subtitle && <p className="mt-5 text-lg md:text-xl opacity-90 max-w-2xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}