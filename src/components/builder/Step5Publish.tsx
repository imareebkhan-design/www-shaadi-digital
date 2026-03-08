import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Sparkles, Shield } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onSelectPlan: (plan: "basic" | "premium" | "elite") => void;
  loading: boolean;
}

const plans = [
  {
    id: "basic" as const,
    name: "Basic",
    price: "₹999",
    icon: Star,
    tagline: "Perfect to get started",
    features: ["1 Wedding Template", "Up to 100 RSVPs", "WhatsApp Sharing", "30-Day Active Link"],
    popular: false,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "₹1,999",
    icon: Crown,
    tagline: "Most popular choice",
    features: ["All Templates", "Unlimited RSVPs", "WhatsApp + SMS Sharing", "90-Day Active Link", "Couple Photo Upload", "RSVP Dashboard", "Priority Support"],
    popular: true,
  },
  {
    id: "elite" as const,
    name: "Elite",
    price: "₹3,499",
    icon: Sparkles,
    tagline: "The ultimate experience",
    features: ["Everything in Premium", "Custom Domain", "365-Day Active Link", "Video Invitation Add-on", "Dedicated Account Manager", "Premium Assisted Setup"],
    popular: false,
  },
];

const Step5Publish = ({ onSelectPlan, loading }: Props) => {
  const [selected, setSelected] = useState<"basic" | "premium" | "elite">("premium");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary/20 mb-3">
          <Sparkles className="w-4.5 h-4.5 text-secondary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-primary mb-1">Publish Your Invitation</h2>
        <p className="font-body text-sm text-muted-foreground">Choose a plan and go live in seconds</p>
      </div>

      <div className="space-y-3">
        {plans.map((plan, i) => (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setSelected(plan.id)}
            className={`relative w-full border p-5 text-left transition-all ${
              selected === plan.id
                ? plan.popular
                  ? "border-secondary bg-secondary/5 shadow-gold"
                  : "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-border hover:shadow-sm"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-4 bg-secondary text-secondary-foreground font-body text-[10px] font-semibold px-3 py-0.5 tracking-wide uppercase">
                Most Popular
              </span>
            )}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  selected === plan.id
                    ? plan.popular ? "bg-secondary/20" : "bg-primary/10"
                    : "bg-muted"
                }`}>
                  <plan.icon className={`w-4 h-4 ${
                    selected === plan.id
                      ? plan.popular ? "text-secondary" : "text-primary"
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="font-body text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold text-primary">{plan.price}</p>
                <p className="font-body text-[10px] text-muted-foreground">one-time</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {plan.features.map((f) => (
                <span key={f} className="flex items-start gap-1.5 font-body text-xs text-muted-foreground">
                  <Check className="w-3 h-3 text-secondary mt-0.5 shrink-0" />
                  {f}
                </span>
              ))}
            </div>

            {/* Selected indicator */}
            {selected === plan.id && (
              <div className="absolute top-5 right-5">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="text-center pt-2">
        <Button
          onClick={() => onSelectPlan(selected)}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-10 font-body text-base gap-2 shadow-md"
        >
          {loading ? (
            <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            <>Pay {plans.find((p) => p.id === selected)?.price} & Go Live 🎉</>
          )}
        </Button>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Shield className="w-3 h-3 text-muted-foreground" />
          <p className="font-body text-[11px] text-muted-foreground">Secure payment via Razorpay • UPI, Cards, Net Banking</p>
        </div>
      </div>
    </div>
  );
};

export default Step5Publish;
