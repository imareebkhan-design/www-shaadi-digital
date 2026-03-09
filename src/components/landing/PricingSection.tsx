import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useRazorpay, type PlanId } from "@/hooks/useRazorpay";
import PostPaymentSignupModal from "@/components/PostPaymentSignupModal";
import PaymentFailedModal from "@/components/PaymentFailedModal";

const Check = () => (
  <div className="w-4 h-4 rounded-full bg-secondary/[0.12] border border-secondary/25 flex items-center justify-center shrink-0 mt-[1px]">
    <svg className="w-2 h-2" viewBox="0 0 10 10" fill="none" stroke="#C9941A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 5 4 7 8 3" /></svg>
  </div>
);

const plans = [
  {
    planId: "shubh" as PlanId,
    name: "Shubh",
    nameHindi: "शुभ",
    price: "999",
    period: "One-time · Active for 1 year",
    featured: false,
    groupLabel: "Essentials",
    features: [
      { text: "1 premium template", dim: false, isNew: false },
      { text: "Up to 100 RSVP responses", dim: false, isNew: false },
      { text: "3 event pages (e.g. Mehndi, Wedding, Reception)", dim: false, isNew: false },
      { text: "WhatsApp-ready share link", dim: false, isNew: false },
      { text: "Google Maps integration", dim: false, isNew: false },
      { text: "Mobile & desktop optimised", dim: false, isNew: false },
      { text: "Couple photo upload", dim: false, isNew: false },
      { text: "RSVP dashboard (basic)", dim: true, isNew: false },
      { text: "Email support", dim: true, isNew: false },
    ],
    btn: "Start Free Preview",
    btnStyle: "outline" as const,
    note: "Preview free · Pay when happy",
  },
  {
    planId: "shaadi" as PlanId,
    name: "Shaadi",
    nameHindi: "शादी",
    price: "1,999",
    oldPrice: "₹2,499",
    period: "One-time · Active for 1 year",
    featured: true,
    badge: "MOST POPULAR — BEST VALUE",
    groupLabel: "Everything in Shubh, plus",
    features: [
      { text: "Unlimited RSVP responses", dim: false, isNew: false },
      { text: "Unlimited event pages", dim: false, isNew: false },
      { text: "RSVP dashboard with analytics", dim: false, isNew: false },
      { text: "Guest meal & diet tracking", dim: false, isNew: true },
      { text: "Auto guest reminders", dim: false, isNew: true },
      { text: "Custom slug link (priya-rohan.shaadi.digital)", dim: false, isNew: false },
      { text: "Background music upload", dim: false, isNew: false },
      { text: "Photo gallery (up to 20)", dim: false, isNew: false },
      { text: "Password protection", dim: false, isNew: false },
      { text: "WhatsApp broadcast list export", dim: false, isNew: true },
    ],
    btn: "Begin Your Invitation",
    btnStyle: "solid" as const,
    note: "Preview free · No card needed",
  },
  {
    planId: "shaahi" as PlanId,
    name: "Shaahi",
    nameHindi: "शाही",
    price: "3,499",
    period: "One-time · Active for 1 year",
    featured: false,
    groupLabel: "Everything in Shaadi, plus",
    features: [
      { text: "Custom designed by our team", dim: false, isNew: false },
      { text: "Cinematic video intro slide", dim: false, isNew: false },
      { text: "Digital shagun / gift registry", dim: false, isNew: true },
      { text: "Live photo wall (guests upload)", dim: false, isNew: true },
      { text: "NRI timezone auto-detection", dim: false, isNew: true },
      { text: "Dedicated relationship manager", dim: false, isNew: false },
      { text: "Priority 24/7 WhatsApp support", dim: false, isNew: false },
      { text: "Post-wedding memory album", dim: false, isNew: true },
    ],
    btn: "Talk to Our Team",
    btnStyle: "outline" as const,
    note: "White-glove service · Limited slots",
  },
];

const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Shaadi.Digital Shubh Plan",
    "description": "Digital wedding invitation with 1 premium template, up to 100 RSVP responses, 3 event pages, WhatsApp-ready share link and Google Maps integration.",
    "image": "https://shaadi.digital/og-image.jpg",
    "sku": "SD-SHUBH-999",
    "brand": { "@type": "Brand", "name": "Shaadi.Digital" },
    "offers": {
      "@type": "Offer",
      "url": "https://shaadi.digital/signup",
      "priceCurrency": "INR",
      "price": "999",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" }
        }
      }
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "50000" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Shaadi.Digital Shaadi Plan",
    "description": "Digital wedding invitation with unlimited RSVPs, unlimited event pages, background music, photo gallery, WhatsApp broadcast export and auto guest reminders.",
    "image": "https://shaadi.digital/og-image.jpg",
    "sku": "SD-SHAADI-1999",
    "brand": { "@type": "Brand", "name": "Shaadi.Digital" },
    "offers": {
      "@type": "Offer",
      "url": "https://shaadi.digital/signup",
      "priceCurrency": "INR",
      "price": "1999",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" }
        }
      }
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "50000" }
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Shaadi.Digital Shaahi Plan",
    "description": "Premium digital wedding invitation with custom design by our team, cinematic video intro, digital gift registry, live photo wall, NRI timezone detection and dedicated relationship manager.",
    "image": "https://shaadi.digital/og-image.jpg",
    "sku": "SD-SHAAHI-3499",
    "brand": { "@type": "Brand", "name": "Shaadi.Digital" },
    "offers": {
      "@type": "Offer",
      "url": "https://shaadi.digital/signup",
      "priceCurrency": "INR",
      "price": "3499",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "INR" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY" }
        }
      }
    },
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "50000" }
  }
];

const PricingSection = () => {
  const { openCheckout, signupModalData, closeSignupModal } = useRazorpay();

  return (
  <section id="pricing" className="section-padding bg-background relative overflow-hidden">
    <Helmet>
      {productSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
    <div className="absolute inset-0 pointer-events-none" style={{
      background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,148,26,0.07) 0%, transparent 60%)",
    }} />

    <div className="relative z-[1] max-w-[1160px] mx-auto">
      <div className="text-center mb-14">
        <div className="section-label justify-center">Simple Pricing</div>
        <h2 className="section-title text-center">Transparent <em>Indian Pricing</em></h2>
        <p className="text-muted-foreground mt-3 text-[15px] font-light">No hidden charges. No per-guest fees. Preview free — pay only when you love it.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.08fr_1fr] gap-0 items-stretch rounded-none md:rounded-[20px] overflow-hidden shadow-[0_24px_80px_rgba(92,26,26,0.1)]">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`p-6 md:p-[44px_36px_40px] relative flex flex-col ${
              p.featured
                ? "bg-[hsl(var(--maroon-dark))] z-[2]"
                : "bg-card border-r border-secondary/10 last:border-r-0 hover:bg-[#fdfaf5] transition-colors"
            }`}
          >
            {p.featured && (p as any).badge && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-secondary to-[#E8B84B] text-center py-1.5 text-[9px] font-bold tracking-[2.5px] uppercase" style={{ color: "hsl(var(--maroon-dark))" }}>
                {(p as any).badge}
              </div>
            )}

            <div className={`text-[10px] tracking-[3px] uppercase font-medium mb-1.5 ${p.featured ? "text-[hsl(var(--gold-light))] mt-7" : "text-secondary"}`}>
              {p.name}
            </div>

            <div className={`font-display text-[36px] md:text-[52px] font-bold leading-none tracking-[-2px] ${p.featured ? "text-white" : ""}`} style={!p.featured ? { color: "hsl(var(--maroon-dark))" } : undefined}>
              <span className="font-display text-xl align-super font-normal tracking-normal">₹</span>{p.price}
            </div>

            <div className={`text-xs mt-1 font-light ${p.featured ? "text-white/45" : "text-muted-foreground"}`}>{p.period}</div>

            {(p as any).oldPrice && (
              <div className="inline-flex items-center gap-1.5 mt-2.5 text-[11px] text-secondary/80">
                <s className="text-muted-foreground opacity-60">{(p as any).oldPrice}</s> Save ₹500
              </div>
            )}

            <div className={`h-px my-6 ${p.featured ? "bg-white/10" : "bg-secondary/[0.12]"}`} />

            <div className={`text-[9px] tracking-[2px] uppercase font-medium my-2.5 ${p.featured ? "text-secondary/50" : "text-secondary/60"}`}>
              {p.groupLabel}
            </div>

            <ul className="flex flex-col gap-2.5 mb-0 flex-1">
              {p.features.map((f) => (
                <li key={f.text} className={`text-[13.5px] flex gap-2.5 items-start leading-[1.5] font-light ${p.featured ? "text-white/60" : "text-muted-foreground"} ${f.dim ? "opacity-35" : ""}`}>
                  <Check />
                  <span>
                    {f.text}
                    {f.isNew && (
                      <span className="inline-block text-[8px] tracking-[1px] bg-secondary/15 text-secondary px-[5px] py-px rounded-[3px] ml-1.5 align-middle font-normal">NEW</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => openCheckout(p.planId)}
              className={`block w-full py-[15px] min-h-[52px] text-center rounded-full text-[11px] font-medium tracking-[2px] uppercase mt-7 transition-all duration-250 ${
                p.btnStyle === "solid"
                  ? "bg-gradient-to-br from-secondary to-[#E8B84B] font-semibold shadow-[0_8px_24px_rgba(201,148,26,0.35)] hover:shadow-[0_12px_32px_rgba(201,148,26,0.5)] hover:-translate-y-px"
                  : `border-[1.5px] ${p.featured ? "border-white/15 text-white/70 hover:bg-white/10" : "border-primary/25 hover:bg-[hsl(var(--maroon-dark))] hover:text-white hover:border-[hsl(var(--maroon-dark))]"}`
              }`}
              style={p.btnStyle === "solid" ? { color: "hsl(var(--maroon-dark))" } : !p.featured ? { color: "hsl(var(--maroon-dark))" } : undefined}
            >
              {p.btn}
            </button>
            <p className={`text-[11px] text-center mt-2.5 font-light ${p.featured ? "text-white/30" : "text-muted-foreground"}`}>{p.note}</p>
          </div>
        ))}
      </div>
    </div>

    {signupModalData && (
      <PostPaymentSignupModal
        open={!!signupModalData}
        planId={signupModalData.planId}
        amount={signupModalData.amount}
        razorpayOrderId={signupModalData.razorpayOrderId}
        onClose={closeSignupModal}
      />
    )}
  </section>
  );
};

export default PricingSection;
