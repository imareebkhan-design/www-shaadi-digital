interface Props {
  brideFamily: string | null;
  groomFamily: string | null;
  brideName: string;
  groomName: string;
}

const InviteFamily = ({ brideFamily, groomFamily, brideName, groomName }: Props) => {
  if (!brideFamily && !groomFamily) return null;

  return (
    <section className="py-14 px-6 bg-background">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-xs tracking-[3px] uppercase text-secondary font-medium mb-2">With blessings of</p>
        <h2 className="font-display text-2xl font-bold mb-8" style={{ color: "hsl(var(--maroon-dark))" }}>
          Our Families
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {brideFamily && (
            <div className="border border-secondary/20 bg-card p-6">
              <p className="font-display text-lg font-bold text-primary mb-1">{brideName}'s Family</p>
              <p className="font-serif text-sm italic text-muted-foreground">{brideFamily}</p>
            </div>
          )}
          {groomFamily && (
            <div className="border border-secondary/20 bg-card p-6">
              <p className="font-display text-lg font-bold text-primary mb-1">{groomName}'s Family</p>
              <p className="font-serif text-sm italic text-muted-foreground">{groomFamily}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InviteFamily;
