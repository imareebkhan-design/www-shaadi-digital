interface Props {
  brideName: string;
  groomName: string;
  weddingDate: string | null;
  brideFamily: string | null;
  groomFamily: string | null;
  motif: string;
  gradientClass: string;
}

const InviteHero = ({ brideName, groomName, weddingDate, brideFamily, groomFamily, motif, gradientClass }: Props) => {
  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <section className={`min-h-[90vh] bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden`}>
      {/* Mandala background */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ccircle cx='150' cy='150' r='140' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3Ccircle cx='150' cy='150' r='110' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3Ccircle cx='150' cy='150' r='80' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3Ccircle cx='150' cy='150' r='50' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "300px 300px",
        backgroundPosition: "center",
      }} />

      <div className="relative z-10">
        {/* Motif */}
        <div className="text-secondary text-3xl mb-6">{motif}</div>

        {/* Header text */}
        <p className="font-serif text-xs tracking-[4px] uppercase text-white/50 mb-8">
          Together with their families
        </p>

        {/* Bride family */}
        {brideFamily && (
          <p className="font-serif text-sm text-white/60 italic mb-1">{brideFamily}</p>
        )}

        {/* Bride name */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{brideName}</h1>

        {/* Ampersand */}
        <p className="font-serif text-2xl text-secondary italic my-3">&</p>

        {/* Groom name */}
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{groomName}</h1>

        {/* Groom family */}
        {groomFamily && (
          <p className="font-serif text-sm text-white/60 italic mt-1">{groomFamily}</p>
        )}

        {/* Divider */}
        <div className="w-16 h-px bg-secondary mx-auto my-8" />

        {/* Date */}
        {formattedDate && (
          <p className="font-body text-sm tracking-[2px] uppercase text-white/70">{formattedDate}</p>
        )}

        {/* Motif bottom */}
        <div className="text-secondary/40 text-2xl mt-10">{motif}</div>
      </div>
    </section>
  );
};

export default InviteHero;
