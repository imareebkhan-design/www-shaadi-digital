interface Props {
  enabled?: boolean;
  text?: string;
  colors?: string[];
  isPreview: boolean;
}

const DresscodeSection = ({ enabled, text, colors, isPreview }: Props) => {
  if (!enabled && !isPreview) return null;
  if (!enabled && isPreview) return null; // Only show if explicitly enabled

  const displayText = text?.trim() || "Traditional Indian attire preferred. Please wear colours from the palette below.";
  const displayColors = colors && colors.length > 0 ? colors : ["#7B1C2E", "#C9941A", "#1a5c30", "#0f172a", "#f472b6"];

  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-md mx-auto text-center">
        <p className="section-label justify-center">What to Wear</p>
        <h2 className="section-title mb-6">Dress Code</h2>
        <p className="font-serif text-base italic text-foreground/70 leading-relaxed mb-8">{displayText}</p>
        <div className="flex justify-center gap-3">
          {displayColors.map((color, i) => (
            <div key={i} className="w-10 h-10 md:w-12 md:h-12 border-2 border-white shadow-md" style={{ backgroundColor: color }} title={color} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DresscodeSection;
