import { useState, useEffect } from "react";

interface Props {
  weddingDate: string;
  isPreview: boolean;
}

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
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-lg mx-auto text-center">
        <p className="section-label justify-center">Save the Date</p>
        <h2 className="section-title mb-10">Counting Down</h2>
        <div className="grid grid-cols-4 gap-3">
          {units.map((u) => (
            <div key={u.label} className="bg-card border border-secondary/20 p-4 md:p-6">
              <span className="font-display text-3xl md:text-5xl font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
                {String(u.value).padStart(2, "0")}
              </span>
              <p className="font-body text-[10px] md:text-xs tracking-[2px] uppercase text-muted-foreground mt-2">{u.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SaveTheDateSection;
