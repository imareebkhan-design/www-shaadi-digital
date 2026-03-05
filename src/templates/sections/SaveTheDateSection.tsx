import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  weddingDate: string;
  isPreview: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const SaveTheDateSection = ({ weddingDate, isPreview }: Props) => {
  const targetDate = weddingDate ? new Date(weddingDate) : isPreview ? new Date(Date.now() + 90 * 86400000) : null;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate?.getTime()]);

  if (!targetDate) return null;

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="container max-w-4xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
        >
          <span className="invite-section-label mb-6 block">Save the date</span>
          <h2 className="invite-section-title mb-16">The Big Day</h2>
        </motion.div>

        <div className="flex justify-center gap-4 md:gap-8 max-w-3xl mx-auto">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.15, ease }}
              className="flex-1 relative"
            >
              <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-5 md:p-8 gold-border shadow-card-wedding overflow-hidden group hover:shadow-gold transition-shadow duration-500">
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <span className="font-display text-4xl md:text-6xl lg:text-7xl text-gold-dark block relative">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="font-body text-[10px] md:text-xs text-muted-foreground/60 tracking-[0.3em] uppercase mt-3 block">
                  {unit.label}
                </span>
              </div>

              {/* Separator dots */}
              {i < units.length - 1 && (
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 flex-col gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold/40" />
                  <span className="w-1 h-1 rounded-full bg-gold/40" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SaveTheDateSection;
