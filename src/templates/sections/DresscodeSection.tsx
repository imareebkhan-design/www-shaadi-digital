import AnimateIn from "@/components/AnimateIn";

interface Props {
  enabled?: boolean;
  text?: string;
  colors?: string[];
  isPreview: boolean;
}

const DresscodeSection = ({ enabled, text, colors, isPreview }: Props) => {
  // Only show if there's actual dress code text or explicitly enabled
  const hasText = text?.trim();
  if (!hasText && !enabled) return null;

  const displayText = hasText || "Traditional Indian attire preferred";

  return (
    <section className="py-16 px-6 bg-card">
      <AnimateIn>
        <div className="max-w-md mx-auto text-center">
          <p className="section-label justify-center">What to Wear</p>
          <h2 className="section-title mb-6">Dress Code</h2>
          <p className="font-serif text-base text-foreground/70 leading-relaxed mb-8">
            We'd love you to dress in <span className="italic font-medium text-foreground">{displayText}</span>
          </p>
          {colors && colors.length > 0 && (
            <div className="flex justify-center gap-4">
              {colors.slice(0, 3).map((color, i) => (
                <div
                  key={i}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>
      </AnimateIn>
    </section>
  );
};

export default DresscodeSection;
