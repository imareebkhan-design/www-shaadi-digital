import { useMemo } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";

type Rsvp = Tables<"rsvps">;

interface RsvpStatCardsProps {
  rsvps: Rsvp[];
}

const RsvpStatCards = ({ rsvps }: RsvpStatCardsProps) => {
  const stats = useMemo(() => {
    const total = rsvps.reduce((sum, r) => sum + r.guest_count, 0);
    // All submitted RSVPs are confirmed in current schema
    return {
      total,
      confirmed: total,
      declined: 0,
      awaiting: 0,
      confirmedPct: total > 0 ? 100 : 0,
      declinedPct: 0,
      awaitingPct: 0,
    };
  }, [rsvps]);

  const cards = [
    {
      label: "Total Guests",
      value: stats.total,
      pct: null,
      icon: Users,
      accent: "border-l-primary",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      pct: stats.confirmedPct,
      icon: CheckCircle2,
      accent: "border-l-[#22c55e]",
      pctLabel: "✓",
    },
    {
      label: "Declined",
      value: stats.declined,
      pct: stats.declinedPct,
      icon: XCircle,
      accent: "border-l-[#ef4444]",
      pctLabel: "✗",
    },
    {
      label: "Awaiting",
      value: stats.awaiting,
      pct: stats.awaitingPct,
      icon: Clock,
      accent: "border-l-[#f59e0b]",
      pctLabel: "⏳",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className={`bg-card border rounded-2xl p-4 md:p-5 border-l-[3px] ${card.accent}`}
          style={{ borderColor: "#ede8e3", borderLeftWidth: 3 }}
        >
          <div className="font-serif text-4xl font-bold text-primary leading-none">
            {card.value}
          </div>
          <div className="font-body text-[11px] uppercase tracking-[2px] mt-2" style={{ color: "#8a6a5a" }}>
            {card.label}
          </div>
          {card.pct !== null && (
            <div className="font-body text-[11px] text-muted-foreground mt-1">
              {card.pctLabel} {card.pct.toFixed(1)}%
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default RsvpStatCards;
