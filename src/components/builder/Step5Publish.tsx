import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Shield, Lock, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { format, differenceInDays, parseISO } from "date-fns";

interface Props {
  onSelectPlan: (plan: "basic" | "premium" | "elite") => void;
  loading: boolean;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
}

const plans = [
  {
    id: "basic" as const,
    name: "Shubh",
    icon: "⭐",
    price: 999,
    originalPrice: null,
    tagline: "Everything you need to share your invite",
    popular: false,
    features: [
      "Your invite goes live instantly",
      "Share to any WhatsApp group",
      "Up to 100 guest RSVPs",
      "Active for 90 days",
      "Edit details anytime, free",
    ],
  },
  {
    id: "premium" as const,
    name: "Shaadi",
    icon: "👑",
    price: 1999,
    originalPrice: 2499,
    tagline: "The complete wedding invitation experience",
    popular: true,
    features: [
      "Everything in Shubh",
      "Unlimited guest RSVPs",
      "Track every response in real time",
      "Your own link: priya-arjun.shaadi.digital",
      "Active for a full year",
      "Background music upload",
      "Photo gallery (up to 20 photos)",
      "Guest meal & diet tracking",
      "Auto-reminders to guests who haven't replied",
    ],
  },
  {
    id: "elite" as const,
    name: "Shaahi",
    icon: "✨",
    price: 3499,
    originalPrice: null,
    tagline: "White-glove service for your special day",
    popular: false,
    features: [
      "Everything in Shaadi",
      "Cinematic video background",
      "Custom designed by our team",
      "Digital gift registry",
      "Live guest photo wall",
      "Dedicated relationship manager",
      "Priority WhatsApp support",
      "Post-wedding memory album",
    ],
  },
];

const formatPrice = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const Step5Publish = ({ onSelectPlan, loading, brideName, groomName, weddingDate }: Props) => {
  const [selected, setSelected] = useState<"basic" | "premium" | "elite">("premium");
  const selectedPlan = plans.find((p) => p.id === selected)!;

  const hasNames = brideName?.trim() && groomName?.trim();
  let formattedDate = "";
  let daysUntil: number | null = null;

  if (weddingDate) {
    try {
      const d = parseISO(weddingDate);
      formattedDate = format(d, "d MMMM yyyy");
      daysUntil = differenceInDays(d, new Date());
      if (daysUntil < 0) daysUntil = null;
    } catch {
      // ignore
    }
  }

  // On mobile, reorder: Shaadi first
  const orderedPlans =
    typeof window !== "undefined" && window.innerWidth < 768
      ? [plans[1], plans[0], plans[2]]
      : plans;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        className="text-center pb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-2xl md:text-3xl text-primary mb-1">
          Your invitation is ready ✨
        </h2>
        {hasNames && (
          <p className="font-display text-base text-foreground/80">
            {brideName?.trim()} &amp; {groomName?.trim()}
            {formattedDate && <span className="text-muted-foreground"> · {formattedDate}</span>}
          </p>
        )}
        <p className="font-body text-sm text-muted-foreground mt-1">
          Choose how you'd like to share it with your loved ones
        </p>
      </motion.div>

      {/* ── Plan Cards ── */}
      <div className="space-y-3">
        {orderedPlans.map((plan, i) => (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelected(plan.id)}
            className={`relative w-full border p-5 text-left transition-all ${
              selected === plan.id
                ? "border-primary border-2 bg-[hsl(var(--primary)/0.03)] shadow-md"
                : "border-border bg-card hover:border-border hover:shadow-sm"
            }`}
          >
            {/* Most Loved badge */}
            {plan.popular && (
              <span className="absolute -top-3 right-4 bg-secondary text-secondary-foreground font-body text-[10px] font-semibold px-3 py-0.5 tracking-wide">
                Most Loved 💛
              </span>
            )}

            {/* Selected checkmark */}
            {selected === plan.id && (
              <div className="absolute top-4 right-4">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            )}

            <div className="flex items-start justify-between pr-8">
              <div className="flex items-center gap-3">
                <span className="text-xl">{plan.icon}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="font-body text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {plan.originalPrice && (
                  <p className="font-body text-xs text-muted-foreground line-through">
                    {formatPrice(plan.originalPrice)}
                  </p>
                )}
                <p className="font-display text-2xl font-bold text-primary">{formatPrice(plan.price)}</p>
                {plan.originalPrice && (
                  <span className="inline-block font-body text-[10px] font-semibold text-secondary bg-secondary/10 px-1.5 py-0.5 mt-0.5">
                    Save {formatPrice(plan.originalPrice - plan.price)}
                  </span>
                )}
                <p className="font-body text-[10px] text-muted-foreground">one-time</p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              {plan.features.map((f) => (
                <span key={f} className="flex items-start gap-2 font-body text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-secondary mt-0.5 shrink-0" />
                  {f}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* ── Urgency ── */}
      <p className="text-center font-body text-sm italic text-[hsl(25,25%,45%)]">
        {daysUntil !== null
          ? `🕐 Your wedding is in ${daysUntil} days — your guests are waiting`
          : "🕐 Your invitation draft is saved and ready to publish"}
      </p>

      {/* ── CTA ── */}
      <div className="text-center pt-2 space-y-3">
        <Button
          onClick={() => onSelectPlan(selected)}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 w-full md:w-auto md:px-14 font-body text-base shadow-md"
        >
          {loading ? (
            <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            <>Publish My Invitation →</>
          )}
        </Button>
        <p className="font-body text-xs text-muted-foreground">
          {formatPrice(selectedPlan.price)} · one-time · no hidden charges
        </p>
      </div>

      {/* ── Trust strip ── */}
      <div className="text-center space-y-2">
        <p className="font-body text-sm font-medium text-primary">
          💛 Love it or we'll make it right — 7-day satisfaction guarantee
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1 font-body text-xs text-[hsl(25,25%,45%)]">
            <Lock className="w-3 h-3" /> Secure Razorpay payment
          </span>
          <span className="flex items-center gap-1 font-body text-xs text-[hsl(25,25%,45%)]">
            <Check className="w-3 h-3" /> Edit anytime, free
          </span>
          <span className="flex items-center gap-1 font-body text-xs text-[hsl(25,25%,45%)]">
            <Smartphone className="w-3 h-3" /> Works on every phone
          </span>
        </div>
      </div>

      {/* ── Testimonial ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#faf8f6] border border-[#ede8e3] rounded-xl p-4"
      >
        <p className="text-secondary text-sm mb-1.5">★★★★★</p>
        <p className="font-body text-[13px] italic text-[#5a3a2a] leading-relaxed">
          "Shaadi se 4 din pehle venue change hua. 2 minutes mein update kar diya — 340 guests ke phones pe automatically naya address pahunch gaya."
        </p>
        <p className="font-body text-xs text-[#8a6a5a] mt-2">
          — Arjun &amp; Kavitha Menon · Bangalore · Shaadi plan
        </p>
      </motion.div>
    </div>
  );
};

export default Step5Publish;
