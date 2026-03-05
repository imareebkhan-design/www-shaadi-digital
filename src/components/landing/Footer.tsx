import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-white/40 px-6 md:px-16 py-16 text-[13px] leading-[1.7]">
    <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-10">
      <div>
        <Link to="/" className="font-display text-2xl font-bold text-primary-foreground block mb-3">
          Shaadi<span className="text-secondary">.</span>Digital
        </Link>
        <p className="text-white/35 leading-[1.8]">
          India's most loved digital wedding invitation platform. Beautiful, personal, and built for every Indian wedding tradition.
        </p>
      </div>

      <div>
        <h5 className="text-white/70 text-[11px] tracking-[2px] uppercase mb-4 font-semibold">Product</h5>
        <ul className="flex flex-col gap-2">
          {["Templates", "Features", "RSVP Dashboard", "Pricing"].map((l) => (
            <li key={l}><a href="#" className="text-white/40 hover:text-secondary transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="text-white/70 text-[11px] tracking-[2px] uppercase mb-4 font-semibold">Company</h5>
        <ul className="flex flex-col gap-2">
          {["About Us", "Blog", "Press", "Contact"].map((l) => (
            <li key={l}><a href="#" className="text-white/40 hover:text-secondary transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="text-white/70 text-[11px] tracking-[2px] uppercase mb-4 font-semibold">Support</h5>
        <ul className="flex flex-col gap-2">
          {["Help Center", "WhatsApp Us", "Privacy Policy", "Refund Policy"].map((l) => (
            <li key={l}><a href="#" className="text-white/40 hover:text-secondary transition-colors">{l}</a></li>
          ))}
        </ul>
      </div>
    </div>

    <div className="max-w-[1100px] mx-auto border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
      <span>© 2026 Shaadi.Digital · Made with ❤️ in India 🇮🇳</span>
      <span>Delhi · Mumbai · Bangalore · Chennai · Hyderabad</span>
    </div>
  </footer>
);

export default Footer;
