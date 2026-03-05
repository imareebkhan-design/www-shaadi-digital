import { motion } from "framer-motion";

interface Props {
  enabled?: boolean;
  text?: string;
  colors?: string[];
  isPreview: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const DresscodeSection = ({ enabled, text, colors, isPreview }: Props) => {
  const hasText = text?.trim();
  if (!hasText && !enabled) return null;

  const displayText = hasText || "Traditional Indian attire preferred";

  return (
    <section className="py-24 md:py-36 bg-card relative overflow-hidden">
      <div className="container max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
        >
          <span className="invite-section-label mb-6 block">What to wear</span>
          <h2 className="invite-section-title mb-8">Dress Code</h2>

          <p className="font-elegant text-lg md:text-xl text-foreground/70 leading-relaxed mb-10">
            We'd love you to dress in <span className="italic font-medium text-foreground">{displayText}</span>
          </p>

          {colors && colors.length > 0 && (
            <div className="flex justify-center gap-5">
              {colors.slice(0, 5).map((color, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease }}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-elegant gold-border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DresscodeSection;
