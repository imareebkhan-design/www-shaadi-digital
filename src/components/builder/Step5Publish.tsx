import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown, Star, Sparkles } from "lucide-react";

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
    features: ["1 Wedding Template", "Up to 100 RSVPs", "WhatsApp Sharing", "7-Day Active Link"],
    popular: false,
  },
  {
    id: "premium" as const,
    name: "Premium",
    price: "₹1,999",
    icon: Crown,
    features: ["All Templates", "Unlimited RSVPs", "WhatsApp + SMS Sharing", "90-Day Active Link", "Couple Photo Upload", "RSVP Dashboard", "Priority Support"],
    popular: true,
  },
  {
    id: "elite" as const,
    name: "Elite",
    price: "₹3,499",
    icon: Sparkles,
    features: ["Everything in Premium", "Custom Domain", "365-Day Active Link", "Video Invitation Add-on", "Dedicated Account Manager", "Premium Assisted Setup"],
    popular: false,
  },
];

const Step5Publish = ({ onSelectPlan, loading }: Props) => {
  const [selected, setSelected] = useState<"basic" | "premium" | "elite">("premium");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-display text-2xl text-primary mb-1">Publish Your Invitation</h2>
        <p className="font-body text-sm text-muted-foreground">Choose a plan to go live</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={`relative border p-5 text-left transition-all ${
              selected === plan.id
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card hover:border-secondary"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-accent-foreground font-body text-xs px-3 py-0.5">
                Most Popular
              </span>
            )}
            <plan.icon className={`w-6 h-6 mb-3 ${selected === plan.id ? "text-primary" : "text-secondary"}`} />
            <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
            <p className="font-display text-2xl font-bold text-primary mt-1">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 font-body text-xs text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => onSelectPlan(selected)}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-10 font-body text-base"
        >
          {loading ? (
            <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
          ) : (
            `Pay ${plans.find((p) => p.id === selected)?.price} & Publish`
          )}
        </Button>
        <p className="font-body text-xs text-muted-foreground mt-3">Secure payment via Razorpay • UPI, Cards, Net Banking</p>
      </div>
    </div>
  );
};

export default Step5Publish;
