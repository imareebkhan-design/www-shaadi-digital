import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/shaadi-digital-logo.svg";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0D0505] text-white/35 text-[13px] leading-[1.7]">
      {/* Newsletter bar */}
      <div className="bg-secondary/[0.06] border-b border-secondary/10 px-5 md:px-16 py-7">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6">
          <div className="text-center md:text-left">
            <div className="font-serif text-[16px] md:text-[18px] text-white italic">Wedding planning tips, template launches & more</div>
            <div className="text-xs text-white/30 mt-0.5">Join 12,000+ couples who get our monthly digest</div>
          </div>
          <div className="flex flex-col md:flex-row shrink-0 w-full md:w-auto border border-secondary/25 rounded overflow-hidden">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-[16px] md:text-[13px] px-[18px] py-[14px] md:py-[11px] w-full md:w-[240px] placeholder:text-white/20"
            />
            <button className="bg-secondary text-[10px] tracking-[1.5px] uppercase font-semibold px-5 py-[14px] md:py-[11px] hover:bg-[#E8B84B] transition-colors min-h-[48px] md:min-h-0" style={{ color: "hsl(var(--maroon-dark))" }}>
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="px-5 md:px-16 py-12 md:py-[60px_60px_48px]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-[2.2fr_1fr_1fr_1fr] gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1 text-center md:text-left">
            <Link to="/" className="block mb-3.5 mx-auto md:mx-0 w-fit">
              <img src={logo} alt="Shaadi.Digital" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="text-[13px] text-white/30 leading-[1.85] font-light max-w-[280px] mx-auto md:mx-0 mb-6">
              India's most loved digital wedding invitation platform — beautiful, personal, and crafted for every Indian tradition, from Punjabi Shaadi to South Indian Kalyanam.
            </p>
            <div className="flex gap-2.5 justify-center md:justify-start">
              <a href="https://instagram.com/shaadi.digital" target="_blank" rel="noopener noreferrer" className="w-[44px] h-[44px] md:w-[34px] md:h-[34px] rounded-lg border border-white/[0.08] flex items-center justify-center text-white/30 hover:border-secondary/40 hover:text-secondary hover:bg-secondary/[0.08] transition-all text-xs" title="Instagram">
                📷
              </a>
              <a href="https://wa.me/917838189916" target="_blank" rel="noopener noreferrer" className="w-[44px] h-[44px] md:w-[34px] md:h-[34px] rounded-lg border border-white/[0.08] flex items-center justify-center text-white/30 hover:border-secondary/40 hover:text-secondary hover:bg-secondary/[0.08] transition-all text-xs" title="WhatsApp">
                💬
              </a>
            </div>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Templates", href: "/templates" },
                { label: "All Features", href: "/#features" },
                { label: "RSVP Dashboard", href: "/#rsvp" },
                { label: "Pricing", href: "/pricing" },
                { label: "What's New", href: "/support" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About Us", href: "/support" },
                { label: "Wedding Blog", href: "/blog" },
                { label: "Press & Media", href: "/support" },
                { label: "Careers", href: "/support" },
                { label: "Contact", href: "/support" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Help Center", href: "/support" },
                { label: "WhatsApp Support", href: "https://wa.me/917838189916?text=Hi%2C%20I%27d%20like%20help%20with%20my%20Shaadi.Digital%20invitation", external: true },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Terms of Service", href: "/terms" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="text-white/60 text-[10px] tracking-[2.5px] uppercase mb-4 md:mb-[18px] font-medium">{col.title}</h5>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) =>
                  l.external ? (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-white/35 hover:text-secondary transition-colors font-light py-1 inline-block min-h-[44px] md:min-h-0 flex items-center">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link to={l.href} className="text-white/35 hover:text-secondary transition-colors font-light py-1 inline-block min-h-[44px] md:min-h-0 flex items-center">
                        {l.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="max-w-[1100px] mx-auto flex gap-4 md:gap-6 flex-wrap justify-center md:justify-start py-6 mt-6 border-t border-white/5">
          {["🛡️ 256-bit SSL Encrypted", "💳 UPI · Razorpay · Cards", "✅ GDPR & IT Act Compliant", "👥 50,000+ couples served", "⭐ 4.9 / 5 average rating · Based on couple feedback"].map((b) => (
            <div key={b} className="flex items-center gap-[7px] text-[11px] text-white/20">{b}</div>
          ))}
        </div>

        {/* Bottom */}
        <div className="max-w-[1100px] mx-auto pt-5 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center text-[11px] text-white/20 gap-4">
          <span>© 2026 Shaadi.Digital · Crafted with care in India</span>
          <div className="flex gap-4 flex-wrap justify-center">
            {["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata"].map((c) => (
              <a key={c} href="#" className="text-[11px] text-white/20 hover:text-secondary transition-colors py-1">{c}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;