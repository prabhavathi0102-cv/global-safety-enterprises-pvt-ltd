import { useState } from "react";
import { MessageCircle, Phone, X, Send, Flame } from "lucide-react";

type Msg = { role: "user" | "bot"; text: string };

const QUICK = [
  "Which fire extinguisher is suitable for electrical fires?",
  "What is the cost of a fire alarm system?",
  "Do you provide AMC services?",
  "How can I request a quotation?",
];

function botReply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("electrical")) return "For electrical fires (Class C), we recommend CO2 or Clean Agent extinguishers — both are non-conductive and leave no residue. We stock 2kg, 4.5kg & 6.8kg CO2 models from Safex.";
  if (t.includes("cost") || t.includes("price") || t.includes("quote") || t.includes("quotation")) return "Pricing depends on site area, panel type (conventional/addressable) and detector count. Please share your requirement via the Contact page or call +91 98406 55558 — we send detailed quotes within 24 hours.";
  if (t.includes("amc") || t.includes("maintenance")) return "Yes — we offer comprehensive AMC contracts covering preventive maintenance, quarterly inspections, and emergency repairs for fire alarms, hydrants, extinguishers and PA systems.";
  if (t.includes("hydrant")) return "A hydrant system uses pressurized water through landing valves, hose reels and pipework to fight large fires. We supply Omex landing valves, hose reels, hoses and sprinklers, with full installation.";
  if (t.includes("alarm")) return "We supply Conventional & Addressable Fire Alarm panels from Ravel, plus smoke/heat detectors and manual call points. Installation, commissioning and AMC included.";
  if (t.includes("pa") || t.includes("public address")) return "We are authorized distributors for Honeywell PA & Voice Evacuation systems — speakers, amplifiers, BGM and emergency announcement systems.";
  if (t.includes("install")) return "We provide turnkey installation for fire alarms, hydrants, PA systems and fire doors with certified technicians and post-install commissioning support.";
  if (t.includes("hour") || t.includes("open")) return "Office hours: Mon–Sat, 9:30 AM – 6:30 PM. Emergency support: 24×7 on +91 98406 55558.";
  if (t.includes("contact") || t.includes("address")) return "Chennai: 295, M.K.N Road, Alandur, Chennai 600016. Tirupur: 3/2, Govindarajulu St, Avinashi Rd, Tirupur 641602. Email: info@globalsafetys.in";
  return "Thanks for your message! I can help with product recommendations, AMC, installation, quotes and contact details. You can also call +91 98406 55558 or use the Contact form for a personalised response.";
}

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm Fire Safety Assistant 🔥 — ask me about products, AMC, installation, or quotes." },
  ]);

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMsgs((m) => [...m, { role: "user", text: value }, { role: "bot", text: botReply(value) }]);
    setInput("");
  }

  return (
    <>
      {/* Floating action buttons */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3 items-end">
        <a
          href="https://wa.me/919840655558"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp"
          className="h-12 w-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-smooth"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden><path d="M20.52 3.48A11.86 11.86 0 0012.04 0C5.5 0 .22 5.28.22 11.82c0 2.08.55 4.11 1.6 5.9L0 24l6.45-1.78a11.8 11.8 0 005.59 1.43h.01c6.54 0 11.82-5.28 11.82-11.82a11.74 11.74 0 00-3.35-8.35zM12.05 21.3h-.01a9.46 9.46 0 01-4.82-1.32l-.34-.2-3.83 1.06 1.02-3.74-.22-.36a9.45 9.45 0 1117.65-4.93 9.46 9.46 0 01-9.45 9.49zm5.41-7.07c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.58-.49-.5-.66-.51l-.56-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.44s1.06 2.83 1.2 3.03c.15.2 2.08 3.17 5.04 4.45.7.3 1.25.49 1.68.62.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.34z"/></svg>
        </a>
        <a
          href="tel:+919840655558"
          aria-label="Call now"
          className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-smooth"
        >
          <Phone className="h-5 w-5" />
        </a>
        <button
          aria-label="Open chat"
          onClick={() => setOpen((v) => !v)}
          className="h-14 w-14 rounded-full bg-fire-gradient text-accent-foreground flex items-center justify-center shadow-fire animate-pulse-ring hover:scale-110 transition-smooth"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed right-4 bottom-24 z-50 w-[92vw] max-w-sm rounded-2xl bg-card shadow-card-hover border border-border overflow-hidden animate-float-up">
          <div className="bg-brand-gradient text-primary-foreground p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center">
              <Flame className="h-5 w-5 animate-flame" />
            </div>
            <div>
              <div className="font-display font-semibold">Fire Safety Assistant</div>
              <div className="text-xs opacity-80">Typically replies instantly</div>
            </div>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-secondary/30">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-card border border-border px-3.5 py-2 text-sm text-foreground"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {msgs.length <= 1 && (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Try asking</div>
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="block w-full text-left text-xs rounded-lg border border-border bg-card hover:border-primary hover:text-primary px-3 py-2 transition-smooth"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 p-3 border-t border-border bg-card"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button type="submit" aria-label="Send" className="h-10 w-10 rounded-lg bg-fire-gradient text-accent-foreground flex items-center justify-center shadow-fire hover:scale-105 transition-smooth">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}