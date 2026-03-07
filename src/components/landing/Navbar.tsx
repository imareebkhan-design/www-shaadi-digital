import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/shaadi-digital-logo.svg";

const navLinks = [
  { label: "Templates", href: "#templates", isRoute: false },
  { label: "Features", href: "#features", isRoute: false },
  { label: "Pricing", href: "#pricing", isRoute: false },
  { label: "Blog", href: "/blog", isRoute: true },
  { label: "FAQ", href: "#faq", isRoute: false },
];

const Navbar = () => {
  const [shadow, setShadow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (l: typeof navLinks[0]) => {
    if (l.isRoute) {
      setMenuOpen(false);
      navigate(l.href);
    } else {
      scrollTo(l.href);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-16 h-[60px] md:h-auto md:py-4 bg-background/92 backdrop-blur-md border-b border-secondary/20 transition-shadow duration-300 ${
          shadow ? "shadow-[0_4px_32px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Shaadi.Digital" className="h-7 md:h-9 w-auto" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-8 list-none">
          {navLinks.map((l) => (
            <li key={l.href}>
              {l.isRoute ? (
                <Link
                  to={l.href}
                  className="text-[13px] font-medium tracking-[0.8px] uppercase text-foreground hover:text-secondary transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <button
                  onClick={() => scrollTo(l.href)}
                  className="text-[13px] font-medium tracking-[0.8px] uppercase text-foreground hover:text-secondary transition-colors"
                >
                  {l.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate("/signup")}
          className="hidden md:inline-block bg-primary text-primary-foreground px-6 py-2.5 text-xs font-medium tracking-[1px] uppercase rounded-full hover:bg-secondary transition-colors"
        >
          Get Started
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-11 h-11 flex items-center justify-center text-foreground"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          )}
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[49] bg-background/98 backdrop-blur-lg flex flex-col md:hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          menuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        style={{ paddingTop: 60 }}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
          {navLinks.map((l) => (
            <button
              key={l.href}
              onClick={() => handleNavClick(l)}
              className="w-full text-center py-4 text-[18px] font-display font-semibold tracking-[0.5px] text-foreground hover:text-secondary transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="px-8 pb-10">
          <button
            onClick={() => { setMenuOpen(false); navigate("/signup"); }}
            className="w-full bg-primary text-primary-foreground py-4 text-[14px] font-semibold tracking-[1.5px] uppercase"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
