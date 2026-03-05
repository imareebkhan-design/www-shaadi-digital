import { ChevronDown } from "lucide-react";
import LetterReveal from "@/components/LetterReveal";
import AnimateIn from "@/components/AnimateIn";

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

const HeroSection = ({ brideName, groomName, brideFamily, groomFamily, formattedDate, photoUrl, gradient, motif }: Props) => (
  <section className={`min-h-screen bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden`}>
    <div className="absolute inset-0 opacity-[0.06] mandala-bg" />

    {photoUrl && (
      <div className="absolute inset-0">
        <img src={photoUrl} alt="" className="w-full h-full object-cover opacity-20" />
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
      </div>
    )}

    <div className="relative z-10">
      <AnimateIn delay={0}>
        <div className="text-secondary text-3xl mb-6">{motif}</div>
      </AnimateIn>
      <AnimateIn delay={0.15}>
        <p className="font-serif text-xs tracking-[4px] uppercase text-white/50 mb-8">Together with their families</p>
      </AnimateIn>
      {brideFamily && (
        <AnimateIn delay={0.25}>
          <p className="font-serif text-sm text-white/60 italic mb-1">{brideFamily}</p>
        </AnimateIn>
      )}
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">
        <LetterReveal text={brideName} delay={0.3} />
      </h1>
      <AnimateIn delay={0.6}>
        <p className="font-serif text-2xl text-secondary italic my-3">&</p>
      </AnimateIn>
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">
        <LetterReveal text={groomName} delay={0.7} />
      </h1>
      {groomFamily && (
        <AnimateIn delay={1.0}>
          <p className="font-serif text-sm text-white/60 italic mt-1">{groomFamily}</p>
        </AnimateIn>
      )}
      <AnimateIn delay={1.1}>
        <div className="w-16 h-px bg-secondary mx-auto my-8" />
      </AnimateIn>
      {formattedDate && (
        <AnimateIn delay={1.2}>
          <p className="font-body text-sm tracking-[2px] uppercase text-white/70">{formattedDate}</p>
        </AnimateIn>
      )}
      <AnimateIn delay={1.3}>
        <div className="text-secondary/40 text-2xl mt-10">{motif}</div>
      </AnimateIn>
    </div>

    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30" style={{ animation: "bounce-scroll 2s infinite" }}>
      <ChevronDown className="w-6 h-6" />
    </div>
  </section>
);

export default HeroSection;
