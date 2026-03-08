import { useMemo } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

type Rsvp = Tables<"rsvps">;

interface BlessingsTabProps {
  rsvps: Rsvp[];
}

const BlessingsTab = ({ rsvps }: BlessingsTabProps) => {
  const blessings = useMemo(
    () => rsvps.filter((r) => r.note && r.note.trim().length > 0),
    [rsvps]
  );

  if (blessings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🙏</div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          Blessings from your guests will appear here
        </h3>
        <p className="font-body text-sm text-muted-foreground max-w-md">
          As guests RSVP and leave messages, their heartfelt blessings will show up on this page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Messages from your loved ones 💌
        </h3>
        <p className="font-body text-sm text-muted-foreground mt-1">
          {blessings.length} {blessings.length === 1 ? "person" : "people"} sent you their blessings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blessings.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="bg-card border rounded-2xl p-5"
            style={{ borderColor: "#ede8e3" }}
          >
            <div className="text-secondary text-xs mb-3">★★★★★</div>
            <p className="font-serif italic text-base leading-relaxed" style={{ color: "#3d2014" }}>
              "{r.note}"
            </p>
            <p className="font-body text-xs mt-4" style={{ color: "#8a6a5a" }}>
              — {r.guest_name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlessingsTab;
