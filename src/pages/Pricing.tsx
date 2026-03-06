import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "999",
    cta: "Get Started",
    featured: false,
    features: [
      "1 Digital Invitation",
      "50 RSVP responses",
      "3 Events",
      "WhatsApp sharing",
      "Google Maps integration",
      "Mobile optimised",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "1,999",
    cta: "Get Started — Best Value",
    featured: true,
    features: [
      "1 Digital Invitation",
      "Unlimited RSVP responses",
      "Unlimited Events",
      "WhatsApp sharing",
      "RSVP Dashboard + Analytics",
      "Password protection",
      "Custom invite URL",
      "Automated guest reminders",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: "3,499",
    cta: "Get Started",
    featured: false,
    features: [
      "Everything in Premium",
      "Custom designed invite (done-for-you)",
      "Dedicated support",
      "Video & music support",
      "Digital gift registry link",
      "NRI timezone settings",
      "Priority 24/7 support",
    ],
  },
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "You can fully customise your invite for free. Payment is only required to publish and share.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes, you can upgrade at any time from your dashboard.",
  },
  {
    q: "What payment methods are accepted?",
    a: "UPI, Net Banking, and Credit/Debit Cards via Razorpay.",
  },
  {
    q: "Can I edit my invite after publishing?",
    a: "Yes, edits are free and unlimited. All guests see the updated invite instantly.",
  },
];

const Pricing = () => {
  const { user } = useAuth();
  const ctaLink = user ? "/dashboard" : "/templates";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Pricing — Shaadi.Digital | Plans Starting at ₹999"
        description="Simple, transparent pricing for your digital wedding invitation. No hidden charges, no per-guest fees. Plans from ₹999."
        canonical="https://shaadi.digital/pricing"
      />
      <Navbar />

      {/* Pricing Cards */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Simple, Transparent <em className="text-secondary">Pricing</em>
            </h1>
            <p className="text-muted-foreground mt-3 text-[15px]">
              No hidden charges. No per-guest fees. One payment for your big day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((p) => (
              <div
                key={p.id}
                className={`rounded p-10 relative transition-all duration-300 ${
                  p.featured
                    ? "border border-secondary scale-[1.04] shadow-lg"
                    : "bg-card border border-secondary/20 hover:border-secondary hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                }`}
                style={p.featured ? { background: "hsl(var(--maroon-dark))" } : undefined}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-foreground px-4 py-1 rounded-full text-[10px] font-semibold tracking-[1.5px] uppercase">
                    Most Popular
                  </div>
                )}

                <div
                  className={`text-[11px] tracking-[2px] uppercase mb-2 ${
                    p.featured ? "text-secondary/80" : "text-secondary"
                  }`}
                >
                  {p.name}
                </div>

                <div
                  className={`font-display text-[44px] font-bold leading-none ${
                    p.featured ? "text-white" : ""
                  }`}
                  style={!p.featured ? { color: "hsl(var(--maroon-dark))" } : undefined}
                >
                  <span className="text-lg align-super">₹</span>
                  {p.price}
                </div>

                <div
                  className={`text-[13px] mt-1 ${
                    p.featured ? "text-white/50" : "text-muted-foreground"
                  }`}
                >
                  One-time · Valid 1 year
                </div>

                <div className={`h-px my-6 ${p.featured ? "bg-white/10" : "bg-secondary/15"}`} />

                <ul className="flex flex-col gap-3 mb-8">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className={`text-sm flex gap-2.5 items-start ${
                        p.featured ? "text-white/65" : "text-muted-foreground"
                      }`}
                    >
                      <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to={ctaLink}
                  className={`block w-full text-center py-3.5 text-xs font-medium tracking-[1.5px] uppercase transition-all ${
                    p.featured
                      ? "bg-secondary text-foreground hover:brightness-110 font-semibold"
                      : "border-[1.5px] border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-4">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Frequently Asked <em className="text-secondary">Questions</em>
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-secondary/15">
                <AccordionTrigger className="font-display text-[17px] hover:no-underline" style={{ color: "hsl(var(--maroon-dark))" }}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-[1.8]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
