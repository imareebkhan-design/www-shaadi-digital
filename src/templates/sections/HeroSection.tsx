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

const HeroSection = ({ brideName, groomName, brideFamily, groomFamily, formattedDate, photoUrl, gradient, motif }: Props) => (
  <section className={`min-h-screen bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden`}>
    {/* Mandala bg */}
    <div className="absolute inset-0 opacity-[0.06] mandala-bg" />

    {/* Photo bg overlay */}
    {photoUrl && (
      <div className="absolute inset-0">
        <img src={photoUrl} alt="" className="w-full h-full object-cover opacity-20" />
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />
      </div>
    )}

    <div className="relative z-10 animate-fade-up">
      <div className="text-secondary text-3xl mb-6">{motif}</div>
      <p className="font-serif text-xs tracking-[4px] uppercase text-white/50 mb-8">Together with their families</p>
      {brideFamily && <p className="font-serif text-sm text-white/60 italic mb-1">{brideFamily}</p>}
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{brideName}</h1>
      <p className="font-serif text-2xl text-secondary italic my-3">&</p>
      <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{groomName}</h1>
      {groomFamily && <p className="font-serif text-sm text-white/60 italic mt-1">{groomFamily}</p>}
      <div className="w-16 h-px bg-secondary mx-auto my-8" />
      {formattedDate && <p className="font-body text-sm tracking-[2px] uppercase text-white/70">{formattedDate}</p>}
      <div className="text-secondary/40 text-2xl mt-10">{motif}</div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30" style={{ animation: "bounce-scroll 2s infinite" }}>
      <ChevronDown className="w-6 h-6" />
    </div>
  </section>
);

export default HeroSection;
