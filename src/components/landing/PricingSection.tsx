import { Link } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "999",
    period: "One-time · Valid 1 year",
    features: ["1 Digital Invitation", "50 RSVP responses", "3 Event pages", "WhatsApp sharing", "Google Maps integration", "Mobile optimized"],
    featured: false,
  },
  {
    name: "Premium",
    price: "1,999",
    period: "One-time · Valid 1 year",
    features: ["1 Digital Invitation", "Unlimited RSVP responses", "Unlimited Event pages", "WhatsApp sharing", "RSVP Dashboard + Analytics", "Password protection", "Custom domain link", "Auto guest reminders"],
    featured: true,
  },
  {
    name: "Elite",
    price: "3,499",
    period: "One-time · Valid 1 year",
    features: ["Everything in Premium", "Custom designed invite", "Dedicated support", "Video & music support", "Digital gift registry link", "Premium NRI timezone settings", "Priority 24/7 support"],
    featured: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="section-padding bg-background">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-14">
        <div className="section-label justify-center">Simple Pricing</div>
        <h2 className="section-title text-center">Transparent <em>Indian Pricing</em></h2>
        <p className="text-muted-foreground mt-3 text-[15px]">No hidden charges. No per-guest fees. Just one simple plan for your big day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded p-10 relative transition-all duration-300 ${
              p.featured
                ? "border border-secondary scale-[1.04] shadow-lg"
                : "bg-card border border-secondary/20 hover:border-secondary hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
            }`}
            style={p.featured ? { background: 'hsl(var(--maroon-dark))' } : undefined}
          >
            {p.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-foreground px-4 py-1 rounded-full text-[10px] font-semibold tracking-[1.5px] uppercase">
                Most Popular
              </div>
            )}

            <div className={`text-[11px] tracking-[2px] uppercase mb-2 ${p.featured ? "text-secondary/80" : "text-secondary"}`}>
              {p.name}
            </div>

            <div className={`font-display text-[44px] font-bold leading-none ${p.featured ? "text-white" : ""}`} style={!p.featured ? { color: 'hsl(var(--maroon-dark))' } : undefined}>
              <span className="text-lg align-super">₹</span>{p.price}
            </div>

            <div className={`text-[13px] mt-1 ${p.featured ? "text-white/50" : "text-muted-foreground"}`}>
              {p.period}
            </div>

            <div className={`h-px my-6 ${p.featured ? "bg-white/10" : "bg-secondary/15"}`} />

            <ul className="flex flex-col gap-3 mb-8">
              {p.features.map((f) => (
                <li key={f} className={`text-sm flex gap-2.5 items-start ${p.featured ? "text-white/65" : "text-muted-foreground"}`}>
                  <span className="text-secondary font-semibold shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/signup"
              className={`block w-full text-center py-3.5 text-xs font-medium tracking-[1.5px] uppercase transition-all ${
                p.featured
                  ? "bg-secondary text-foreground hover:brightness-110 font-semibold"
                  : "border-[1.5px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
