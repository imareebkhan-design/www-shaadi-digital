import AnimateIn from "@/components/AnimateIn";

interface Props {
  brideName: string;
  groomName: string;
  brideFamily: string;
  groomFamily: string;
  photoUrl?: string;
  gradient: string;
}

const CoupleSection = ({ brideName, groomName, brideFamily, groomFamily, photoUrl, gradient }: Props) => (
  <section className="py-16 px-6 bg-background">
    <div className="max-w-lg mx-auto">
      <AnimateIn>
        <div className="text-center mb-10">
          <p className="section-label justify-center">With blessings of</p>
          <h2 className="section-title">The Couple</h2>
        </div>
      </AnimateIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AnimateIn direction="left" delay={0.15}>
          <div className="border border-secondary/20 bg-card p-6 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
            <div className="text-4xl mb-4">👰</div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">{brideName}</h3>
            {brideFamily && <p className="font-serif text-sm italic text-muted-foreground leading-relaxed">{brideFamily}</p>}
          </div>
        </AnimateIn>
        <AnimateIn direction="right" delay={0.25}>
          <div className="border border-secondary/20 bg-card p-6 text-center relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
            <div className="text-4xl mb-4">🤵</div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">{groomName}</h3>
            {groomFamily && <p className="font-serif text-sm italic text-muted-foreground leading-relaxed">{groomFamily}</p>}
          </div>
        </AnimateIn>
      </div>
    </div>
  </section>
);

export default CoupleSection;
