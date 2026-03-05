import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-12 px-4">
    <div className="container max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div>
          <p className="font-display text-xl font-bold text-card mb-3">
            Shaadi<span className="text-secondary">.</span>Digital
          </p>
          <p className="font-body text-sm text-card/50 leading-relaxed">
            India's premium digital wedding invitation platform. Beautiful, personalised, instant.
          </p>
        </div>

        <div>
          <p className="font-body text-xs font-semibold text-card/40 uppercase tracking-widest mb-4">Platform</p>
          <ul className="space-y-2">
            {["Templates", "How It Works", "Pricing", "FAQ"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="font-body text-sm text-card/60 hover:text-secondary transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-xs font-semibold text-card/40 uppercase tracking-widest mb-4">Legal</p>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms of Service", "Refund Policy"].map((l) => (
              <li key={l}>
                <a href="#" className="font-body text-sm text-card/60 hover:text-secondary transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-body text-xs font-semibold text-card/40 uppercase tracking-widest mb-4">Contact</p>
          <p className="font-body text-sm text-card/60">hello@shaadi.digital</p>
          <p className="font-body text-sm text-card/60 mt-1">Mumbai, India</p>
        </div>
      </div>

      <div className="border-t border-card/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-body text-xs text-card/40">
          © 2026 Shaadi.Digital. All rights reserved.
        </p>
        <p className="font-body text-xs text-card/40 flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-secondary fill-secondary" /> in India
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
