import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NikahEnvelopeIntroProps {
  brideName: string;
  groomName: string;
  weddingDate?: string;
  onOpen: () => void;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

/** Generate deterministic-ish star positions */
const generateStars = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    left: `${((i * 37 + 19) % 100)}%`,
    top: `${((i * 53 + 7) % 100)}%`,
    w: i % 4 === 0 ? 2 : 1,
    h: i % 5 === 0 ? 2 : 1,
    opacity: 0.1 + (i % 7) * 0.035,
    dur: 3 + (i % 4) * 1.2,
    delay: (i % 10) * 0.3,
    anim: `twinkle-${(i % 3) + 1}`,
  }));

const CornerOrnament = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`w-5 h-5 opacity-30 ${className || ""}`}>
    <path d="M0 0L24 0L24 2.5L2.5 2.5L2.5 24L0 24Z" fill="hsl(var(--template-accent, var(--gold)))" />
  </svg>
);

const CrescentMoon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
    <path
      d="M20 14C20 7.4 15.5 2 11 1C12 0.5 13.2 0 14.5 0C21 0 26 5.5 26 14C26 22.5 21 28 14.5 28C13.2 28 12 27.5 11 27C15.5 26 20 20.6 20 14Z"
      fill="hsl(var(--template-accent, var(--gold)))"
      fillOpacity={0.85}
    />
  </svg>
);

const NikahEnvelopeIntro = ({ brideName, groomName, weddingDate, onOpen }: NikahEnvelopeIntroProps) => {
  const [phase, setPhase] = useState<"sealed" | "breaking" | "opening" | "done">("sealed");
  const stars = useMemo(() => generateStars(50), []);

  const formattedDate = weddingDate
    ? (() => {
        const d = new Date(weddingDate);
        return `${d.getDate().toString().padStart(2, "0")} · ${(d.getMonth() + 1).toString().padStart(2, "0")} · ${d.getFullYear()}`;
      })()
    : null;

  const handleTap = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("breaking");
    setTimeout(() => setPhase("opening"), 600);
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2800);
  }, [phase, onOpen]);

  useEffect(() => {
    const timer = setTimeout(handleTap, 2500);
    return () => clearTimeout(timer);
  }, [handleTap]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "hsl(var(--template-bg, 222 60% 10%))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease }}
        >
          {/* Star field */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {stars.map((s, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.w,
                  height: s.h,
                  background: "hsl(var(--template-text, 210 40% 96%))",
                  opacity: s.opacity,
                  animation: `${s.anim} ${s.dur}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Envelope */}
          <motion.div
            className="relative cursor-pointer"
            onClick={handleTap}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            <div className="relative" style={{ perspective: 1200 }}>
              <div className="relative w-[300px] h-[200px] sm:w-[380px] sm:h-[250px] md:w-[440px] md:h-[290px]">
                {/* Envelope body */}
                <div
                  className="absolute inset-0 rounded-sm"
                  style={{
                    background: "hsl(var(--template-bg, 222 60% 10%))",
                    border: "1px solid hsl(var(--template-accent, var(--gold)) / 0.4)",
                    boxShadow: "0 25px 70px rgba(0,0,0,0.6), inset 0 0 40px hsl(var(--template-accent, var(--gold)) / 0.02)",
                  }}
                />

                {/* Corner ornaments */}
                <div className="absolute top-2 left-2"><CornerOrnament /></div>
                <div className="absolute top-2 right-2"><CornerOrnament className="rotate-90" /></div>
                <div className="absolute bottom-2 right-2"><CornerOrnament className="rotate-180" /></div>
                <div className="absolute bottom-2 left-2"><CornerOrnament className="-rotate-90" /></div>

                {/* Inner border */}
                <div
                  className="absolute inset-3 rounded-sm pointer-events-none"
                  style={{ border: "1px solid hsl(var(--template-accent, var(--gold)) / 0.1)" }}
                />

                {/* Cross-hair lines */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 -top-4 w-[1.5px]"
                  style={{
                    height: "calc(100% + 32px)",
                    background: "linear-gradient(180deg, transparent 0%, hsl(var(--template-accent, var(--gold)) / 0.4) 15%, hsl(var(--template-accent, var(--gold)) / 0.4) 85%, transparent 100%)",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 -left-3 h-[1.5px]"
                  style={{
                    width: "calc(100% + 24px)",
                    background: "linear-gradient(90deg, transparent 0%, hsl(var(--template-accent, var(--gold)) / 0.4) 10%, hsl(var(--template-accent, var(--gold)) / 0.4) 90%, transparent 100%)",
                  }}
                />

                {/* Center dot */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--template-accent, var(--gold)) / 0.5), hsl(var(--template-accent, var(--gold)) / 0.15))",
                    boxShadow: "0 0 10px hsl(var(--template-accent, var(--gold)) / 0.25)",
                  }}
                />

                {/* Top flap */}
                <motion.div
                  className="absolute -top-[1px] left-0 w-full origin-top z-[15]"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={phase === "opening" ? { rotateX: -180 } : { rotateX: 0 }}
                  transition={{ duration: 1.3, ease }}
                >
                  <svg viewBox="0 0 440 150" preserveAspectRatio="none" className="w-full block">
                    <defs>
                      <linearGradient id="nikahFlapGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--template-accent, var(--gold)))" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path d="M0 0 L220 140 L440 0 Z" fill="hsl(222 60% 10%)" stroke="hsl(var(--template-accent, var(--gold)))" strokeWidth={0.8} strokeOpacity={0.35} />
                    <path d="M0 0 L220 140 L440 0 Z" fill="url(#nikahFlapGrad)" />
                  </svg>
                </motion.div>

                {/* Wax seal — crescent moon */}
                <AnimatePresence>
                  {(phase === "sealed" || phase === "breaking") && (
                    <motion.button
                      className="absolute left-1/2 -translate-x-1/2 -bottom-7 z-20 cursor-pointer focus:outline-none"
                      aria-label="Tap to open invitation"
                      exit={{ scale: [1, 1.3, 0], opacity: [1, 1, 0] }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full -m-3"
                        style={{
                          background: "radial-gradient(circle, hsl(var(--template-accent, var(--gold)) / 0.15), transparent 70%)",
                        }}
                        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.15, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                      <div
                        className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center"
                        style={{
                          background: "radial-gradient(circle at 38% 32%, hsl(0 40% 30%), hsl(0 45% 18%))",
                          boxShadow: "0 4px 18px rgba(0,0,0,0.55), inset 0 1px 3px rgba(134,60,60,0.3), inset 0 -2px 3px rgba(0,0,0,0.35)",
                          border: "1px solid hsl(0 30% 35%)",
                        }}
                      >
                        <CrescentMoon />
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Inner card content */}
                <motion.div
                  className="absolute inset-3 rounded-sm flex items-center justify-center overflow-hidden"
                  style={{
                    background: "hsl(var(--template-bg, 222 60% 10%))",
                    border: "1px solid hsl(var(--template-accent, var(--gold)) / 0.15)",
                  }}
                  animate={phase === "opening" ? { y: -60 } : { y: 0 }}
                  transition={{ duration: 1.4, delay: 0.4, ease }}
                >
                  <div className="text-center space-y-3">
                    <p
                      className="font-display text-sm"
                      style={{ color: "hsl(var(--template-accent, var(--gold)))" }}
                    >
                      بِسْمِ ٱللَّهِ
                    </p>
                    <p
                      className="font-serif italic text-xl"
                      style={{ color: "hsl(var(--template-accent, var(--gold)))" }}
                    >
                      {brideName} & {groomName}
                    </p>
                    {formattedDate && (
                      <p
                        className="font-body text-[10px] tracking-[0.15em] opacity-70"
                        style={{ color: "hsl(var(--template-text-muted, 210 20% 65%))" }}
                      >
                        {formattedDate}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Tap instruction */}
            {phase === "sealed" && (
              <motion.p
                className="text-center mt-12 font-body text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "hsl(var(--template-text-muted, 210 20% 65%) / 0.5)" }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Tap to open
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NikahEnvelopeIntro;
