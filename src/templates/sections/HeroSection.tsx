import { motion } from "framer-motion";

interface Props {
  brideName: string;
  groomName: string;
  brideFamily: string;
  groomFamily: string;
  formattedDate: string | null;
  weddingCity?: string;
  photoUrl?: string;
  gradient: string;
  motif: string;
  heroMediaType?: "photo" | "video";
  heroMediaUrl?: string;
  isPreview?: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const HeroSection = ({ brideName, groomName, formattedDate, weddingCity, photoUrl, gradient, heroMediaType, heroMediaUrl, isPreview }: Props) => {
  const displayCity = weddingCity || (isPreview ? "Your City" : "");
  const useVideo = heroMediaType === "video" && heroMediaUrl;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-burgundy">
      {/* BG layer: video, photo, or gradient */}
      {useVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={heroMediaUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : photoUrl || (heroMediaType !== "video" && heroMediaUrl) ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroMediaUrl || photoUrl})` }}
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-burgundy/60" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-burgundy/40 via-transparent to-burgundy/70" />

      {/* Noise grain texture */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease }}
          className="mb-6"
        >
          <span className="inline-block font-body text-[10px] md:text-xs tracking-[0.5em] uppercase text-gold-light/60 border border-gold/20 px-6 py-2 rounded-full backdrop-blur-sm">
            You are cordially invited
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.8, ease }}
        >
          <h1 className="font-display text-primary-foreground text-6xl md:text-8xl lg:text-[10rem] font-light leading-[0.85] tracking-tight">
            {brideName}
          </h1>
          <div className="my-4 md:my-6 flex items-center justify-center gap-6">
            <div className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent to-gold/50" />
            <span className="font-elegant text-gold text-2xl md:text-4xl italic">&amp;</span>
            <div className="h-px w-16 md:w-28 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
          <h1 className="font-display text-primary-foreground text-6xl md:text-8xl lg:text-[10rem] font-light leading-[0.85] tracking-tight">
            {groomName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 1.6, ease: "easeOut" }}
          className="mt-12 md:mt-16"
        >
          {formattedDate && (
            <p className="font-elegant text-gold-light/60 text-base md:text-xl tracking-[0.15em]">
              {formattedDate.split(" ").join(" · ")}
            </p>
          )}
          {displayCity && (
            <p className="font-elegant text-gold-light/40 text-sm md:text-base tracking-[0.2em] mt-2">
              {displayCity}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 2.2, ease: "easeOut" }}
          className="mt-14"
        >
          <button
            onClick={() => document.getElementById("countdown")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-3 font-body text-[10px] md:text-xs tracking-[0.3em] uppercase text-gold-light/70 hover:text-gold transition-all duration-500"
          >
            <span>Explore</span>
            <motion.span
              animate={{ y: [0, 3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
          </button>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
