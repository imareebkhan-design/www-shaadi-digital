import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/shaadi-digital-logo.svg";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0D0505] text-white/35 text-[13px] leading-[1.7]">
      {/* Newsletter bar */}
      <div className="bg-secondary/[0.06] border-b border-secondary/10 px-6 md:px-16 py-7">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-serif text-[18px] text-white italic">Wedding planning tips, template launches & more</div>
            <div className="text-xs text-white/30 mt-0.5">Join 12,000+ couples who get our monthly digest</div>
          </div>
          <div className="flex shrink-0 border border-secondary/25 rounded overflow-hidden">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-[13px] px-[18px] py-[11px] w-[240px] placeholder:text-white/20"
            />
            <button className="bg-secondary text-[10px] tracking-[1.5px] uppercase font-semibold px-5 py-[11px] hover:bg-[#E8B84B] transition-colors" style={{ color: "hsl(var(--maroon-dark))" }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="px-6 md:px-16 py-[60px_60px_48px]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2.2fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link to="/" className="block mb-3.5">
              <img src={logo} alt="Shaadi.Digital" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-[13px] text-white/30 leading-[1.85] font-light max-w-[280px] mb-6">
              India's most loved digital wedding invitation platform — beautiful, personal, and crafted for every Indian tradition, from Punjabi Shaadi to South Indian Kalyanam.
            </p>
            <div className="flex gap-2.5">
              {["Instagram", "YouTube", "Pinterest", "WhatsApp"].map((s) => (
                <a key={s} href="#" className="w-[34px] h-[34px] rounded-lg border border-white/[0.08] flex items-center justify-center text-white/30 hover:border-secondary/40 hover:text-secondary hover:bg-secondary/[0.08] transition-all text-xs" title={s}>
                  {s === "Instagram" ? "📷" : s === "YouTube" ? "▶" : s === "Pinterest" ? "📌" : "💬"}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Product", links: ["Templates", "All Features", "RSVP Dashboard", "Pricing", "What's New"] },
            { title: "Company", links: ["About Us", "Wedding Blog", "Press & Media", "Careers", "Contact"] },
            { title: "Support", links: ["Help Center", "WhatsApp Support", "Privacy Policy", "Refund Policy", "Terms of Service"] },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="text-white/60 text-[10px] tracking-[2.5px] uppercase mb-[18px] font-medium">{col.title}</h5>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-white/35 hover:text-secondary transition-colors font-light">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="max-w-[1100px] mx-auto flex gap-6 flex-wrap py-6 mt-6 border-t border-white/5">
          {["🛡️ 256-bit SSL Encrypted", "💳 UPI · Razorpay · Cards", "✅ GDPR & IT Act Compliant", "👥 50,000+ couples served", "⭐ 4.9 / 5 average rating"].map((b) => (
            <div key={b} className="flex items-center gap-[7px] text-[11px] text-white/20">{b}</div>
          ))}
        </div>

        {/* Bottom */}
        <div className="max-w-[1100px] mx-auto pt-5 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center text-[11px] text-white/20 gap-4">
          <span>© 2026 Shaadi.Digital · Crafted with care in India</span>
          <div className="flex gap-4">
            {["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata"].map((c) => (
              <a key={c} href="#" className="text-[11px] text-white/20 hover:text-secondary transition-colors">{c}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
