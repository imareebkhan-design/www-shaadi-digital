import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Basic",
    price: "₹499",
    desc: "Perfect for a simple, elegant invite",
    features: [
      "1 Premium Template",
      "Up to 3 Events",
      "WhatsApp Sharing",
      "50 RSVP Responses",
      "30-Day Active Link",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹999",
    desc: "Most popular — everything you need",
    features: [
      "All Templates Unlocked",
      "Up to 6 Events",
      "WhatsApp + QR Sharing",
      "Unlimited RSVPs",
      "Google Maps Embed",
      "Photo Upload",
      "1-Year Active Link",
    ],
    cta: "Choose Premium",
    highlight: true,
  },
  {
    name: "Elite",
    price: "₹2,499",
    desc: "White-glove assisted experience",
    features: [
      "Everything in Premium",
      "Dedicated Design Assist",
      "Custom Colour Tweaks",
      "Priority Support",
      "Guest List CSV Export",
      "Lifetime Link",
    ],
    cta: "Go Elite",
    highlight: false,
  },
];

const PricingSection = () => (
  <section id="pricing" className="section-padding bg-background">
    <div className="container text-center">
      <p className="font-serif italic text-secondary text-base mb-2">Transparent Pricing</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        Choose Your Plan
      </h2>
      <div className="gold-divider mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`border p-8 flex flex-col text-left transition-all duration-300 ${
              p.highlight
                ? "border-secondary bg-card shadow-lg scale-[1.02] relative"
                : "border-border bg-card hover:border-secondary"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-card font-body text-xs font-semibold px-4 py-1">
                MOST POPULAR
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-foreground mb-1">{p.name}</h3>
            <p className="font-body text-xs text-muted-foreground mb-4">{p.desc}</p>
            <p className="font-display text-4xl font-bold text-primary mb-6">
              {p.price}
              <span className="font-body text-sm font-normal text-muted-foreground"> / invite</span>
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span className="font-body text-sm text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className={`w-full font-body ${
                p.highlight ? "" : "bg-card text-primary border border-primary hover:bg-primary hover:text-primary-foreground"
              }`}
              asChild
            >
              <Link to="/signup">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
