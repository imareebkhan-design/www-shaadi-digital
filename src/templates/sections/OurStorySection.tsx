import { motion } from "framer-motion";

interface Props {
  story?: string;
  isPreview: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const OurStorySection = ({ story, isPreview }: Props) => {
  const text = story?.trim() || (isPreview ? "We met on a rainy evening in Delhi, and from that very first cup of chai together, we knew something beautiful had begun. Through laughter, late-night conversations, and countless adventures, our love story has been nothing short of magical." : null);
  if (!text) return null;

  return (
    <section className="py-24 md:py-36 bg-card relative overflow-hidden">
      <div className="container max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
        >
          <span className="invite-section-label mb-6 block">Our Journey</span>
          <h2 className="invite-section-title mb-10">Our Story</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.2, ease }}
        >
          <div className="ornamental-divider mb-8">
            <span className="font-elegant text-gold text-2xl italic">❦</span>
          </div>
          <p className="font-elegant text-lg md:text-xl italic text-foreground/80 leading-relaxed">
            "{text}"
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default OurStorySection;
