import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Props {
  brideName: string;
  groomName: string;
  brideFamily: string;
  groomFamily: string;
  formattedDate: string | null;
  photoUrl?: string;
  gradient: string;
  motif: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

const HeroSection = ({ brideName, groomName, brideFamily, groomFamily, formattedDate, photoUrl, gradient, motif }: Props) => {
  // Calculate animation timeline
  const timeline = useMemo(() => {
    const motifStart = 0.4;
    const brideStart = 0.7;
    const brideEnd = brideStart + brideName.length * 0.04 + 0.3;
    const ampersandStart = brideEnd;
    const groomStart = ampersandStart + 0.3;
    const groomEnd = groomStart + groomName.length * 0.04 + 0.3;
    const dateStart = groomEnd + 0.1;
    const scrollStart = dateStart + 0.5;
    return { motifStart, brideStart, ampersandStart, groomStart, dateStart, scrollStart };
  }, [brideName.length, groomName.length]);

  return (
    <>
      {/* Full page fade from black */}
      <motion.div
        className="fixed inset-0 z-[60] bg-black pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease }}
        onAnimationComplete={(def: any) => {
          // Remove from DOM flow after fade
          if (def.opacity === 0) {
            const el = document.getElementById("hero-curtain");
            if (el) el.style.display = "none";
          }
        }}
        id="hero-curtain"
      />

      <section className="h-screen w-full relative overflow-hidden flex items-center justify-center">
        {/* BG layer: photo or gradient */}
        {photoUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${photoUrl})` }}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />

        {/* Noise grain texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />

        {/* Centered content */}
        <div className="relative z-10 text-center px-6">
          {/* Motif */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: timeline.motifStart }}
            className="text-secondary text-3xl mb-6"
          >
            {motif}
          </motion.div>

          {/* Families header */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: timeline.motifStart + 0.15 }}
            className="font-serif text-xs tracking-[4px] uppercase text-white/50 mb-8"
          >
            Together with their families
          </motion.p>

          {/* Bride family */}
          {brideFamily && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: timeline.brideStart - 0.15 }}
              className="font-serif text-sm text-white/60 italic mb-1"
            >
              {brideFamily}
            </motion.p>
          )}

          {/* Bride name — letter by letter */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2" aria-label={brideName}>
            {brideName.split("").map((char, i) => (
              <motion.span
                key={`b-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: timeline.brideStart + i * 0.04 }}
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          {/* Ampersand */}
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease, delay: timeline.ampersandStart }}
            className="font-serif text-2xl text-secondary italic my-3"
          >
            &
          </motion.p>

          {/* Groom name — letter by letter */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2" aria-label={groomName}>
            {groomName.split("").map((char, i) => (
              <motion.span
                key={`g-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease, delay: timeline.groomStart + i * 0.04 }}
                style={{ display: "inline-block" }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </h1>

          {/* Groom family */}
          {groomFamily && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: timeline.groomStart + groomName.length * 0.04 + 0.1 }}
              className="font-serif text-sm text-white/60 italic mt-1"
            >
              {groomFamily}
            </motion.p>
          )}

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease, delay: timeline.dateStart - 0.15 }}
            className="w-16 h-px bg-secondary mx-auto my-8 origin-center"
          />

          {/* Date — slides up */}
          {formattedDate && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: timeline.dateStart }}
              className="font-body text-sm tracking-[2px] uppercase text-white/70"
            >
              {formattedDate}
            </motion.p>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: timeline.scrollStart }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
          style={{ animation: "bounce-scroll 2s infinite" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>
    </>
  );
};

export default HeroSection;
