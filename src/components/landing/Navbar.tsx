import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Templates", href: "#templates" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [shadow, setShadow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-4 bg-background/92 backdrop-blur-md border-b border-secondary/20 transition-shadow duration-300 ${
        shadow ? "shadow-[0_4px_32px_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <Link to="/" className="font-display text-[22px] font-bold tracking-[0.5px] text-primary">
        Shaadi<span className="text-secondary">.</span>Digital
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {navLinks.map((l) => (
          <li key={l.href}>
            <button
              onClick={() => scrollTo(l.href)}
              className="text-[13px] font-medium tracking-[0.8px] uppercase text-foreground hover:text-secondary transition-colors"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/signup")}
        className="hidden md:inline-block bg-primary text-primary-foreground px-6 py-2.5 text-xs font-medium tracking-[1px] uppercase hover:bg-secondary transition-colors"
      >
        Get Started
      </button>

      {/* Mobile: just CTA */}
      <button
        onClick={() => navigate("/signup")}
        className="md:hidden bg-primary text-primary-foreground px-4 py-2 text-xs font-medium tracking-[1px] uppercase"
      >
        Start
      </button>
    </nav>
  );
};

export default Navbar;
