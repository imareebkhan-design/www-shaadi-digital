import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeIntroProps {
  brideName: string;
  groomName: string;
  onOpen: () => void;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const EnvelopeIntro = ({ brideName, groomName, onOpen }: EnvelopeIntroProps) => {
  const [phase, setPhase] = useState<"sealed" | "breaking" | "opening" | "done">("sealed");
  const initials = `${brideName.charAt(0)}&${groomName.charAt(0)}`;

  // Auto-open sequence
  const handleTap = useCallback(() => {
    if (phase !== "sealed") return;
    setPhase("breaking");
    setTimeout(() => setPhase("opening"), 600);
    setTimeout(() => {
      setPhase("done");
      onOpen();
    }, 2800);
  }, [phase, onOpen]);

  // Automatically start opening after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleTap();
    }, 2000);
    return () => clearTimeout(timer);
  }, [handleTap]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "hsl(var(--burgundy))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease }}
        >
          {/* Ambient particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: "hsl(var(--gold-light))",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -40],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          {/* Envelope container */}
          <motion.div
            className="relative cursor-pointer"
            onClick={handleTap}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            <div
              className="relative w-[320px] h-[220px] md:w-[420px] md:h-[280px]"
              style={{ perspective: "1200px" }}
            >
              {/* Back of envelope */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, hsl(var(--maroon)), hsl(var(--burgundy)))",
                  border: "1px solid hsl(var(--gold) / 0.3)",
                  boxShadow: "0 20px 60px -15px rgba(0,0,0,0.5), inset 0 1px 0 hsl(var(--gold) / 0.1)",
                }}
              />

              {/* Gold inner border */}
              <div
                className="absolute inset-3 rounded border pointer-events-none"
                style={{ borderColor: "hsl(var(--gold) / 0.15)" }}
              />

              {/* Letter inside */}
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <AnimatePresence>
                  {phase === "opening" && (
                    <motion.div
                      className="absolute left-3 right-3 rounded-md flex items-center justify-center"
                      style={{
                        background: "hsl(var(--ivory))",
                        height: "80%",
                        bottom: "10%",
                        boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
                      }}
                      initial={{ y: 0 }}
                      animate={{ y: -80 }}
                      transition={{ duration: 1.6, delay: 0.5, ease }}
                    >
                      <div className="text-center px-6">
                        <motion.p
                          className="font-elegant text-[10px] tracking-[0.3em] uppercase"
                          style={{ color: "hsl(var(--maroon))" }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1, duration: 0.6 }}
                        >
                          You are invited to
                        </motion.p>
                        <motion.p
                          className="font-display text-xl md:text-2xl mt-2"
                          style={{ color: "hsl(var(--maroon))" }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2, duration: 0.6 }}
                        >
                          {brideName} & {groomName}
                        </motion.p>
                        <motion.div
                          className="mt-2 mx-auto w-10 h-px"
                          style={{ background: "hsl(var(--gold))" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1.4, duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom flap */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: "50%",
                  background: "linear-gradient(0deg, hsl(var(--maroon)), hsl(var(--maroon-light) / 0.6))",
                  clipPath: "polygon(0 100%, 50% 20%, 100% 100%)",
                }}
              />

              {/* Top flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top z-20"
                style={{ height: "55%", transformStyle: "preserve-3d" }}
                animate={phase === "opening" ? { rotateX: -180 } : { rotateX: 0 }}
                transition={{ duration: 1.3, ease }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, hsl(var(--maroon-light)), hsl(var(--maroon)))",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, hsl(var(--burgundy)), hsl(var(--maroon)))",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    transform: "rotateX(180deg)",
                    backfaceVisibility: "hidden",
                  }}
                />
              </motion.div>

              {/* Wax seal */}
              <AnimatePresence>
                {(phase === "sealed" || phase === "breaking") && (
                  <motion.div
                    className="absolute left-1/2 z-30"
                    style={{ top: "30%", x: "-50%" }}
                    exit={{
                      scale: [1, 1.3, 0],
                      opacity: [1, 1, 0],
                      rotate: [0, 15, -10],
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full -m-3"
                      style={{
                        background: "radial-gradient(circle, hsl(var(--gold) / 0.4), transparent)",
                        filter: "blur(8px)",
                      }}
                      animate={phase === "sealed" ? {
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.15, 1],
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="relative rounded-full flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, hsl(0 70% 40%), hsl(0 65% 28%))",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.2)",
                        width: "clamp(56px, 5vw, 72px)",
                        height: "clamp(56px, 5vw, 72px)",
                      }}
                      animate={phase === "sealed" ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span
                        className="font-display text-base md:text-lg font-bold"
                        style={{
                          color: "hsl(var(--gold-light))",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}
                      >
                        {initials}
                      </span>
                    </motion.div>

                    {phase === "breaking" &&
                      Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: "hsl(0 65% 35%)",
                            top: "50%",
                            left: "50%",
                          }}
                          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                          animate={{
                            x: Math.cos((i / 8) * Math.PI * 2) * 50,
                            y: Math.sin((i / 8) * Math.PI * 2) * 50,
                            scale: 0,
                            opacity: 0,
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tap instruction */}
            {phase === "sealed" && (
              <motion.p
                className="text-center mt-8 font-body text-[10px] md:text-xs tracking-[0.4em] uppercase"
                style={{ color: "hsl(var(--gold-light) / 0.5)" }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Tap the seal to open
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnvelopeIntro;
