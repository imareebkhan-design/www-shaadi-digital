import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface Props {
  brideName: string;
  groomName: string;
  rsvpDeadline?: string;
  isPreview?: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const RsvpSection = ({ brideName, groomName, rsvpDeadline, isPreview }: Props) => {
  const formattedDeadline = rsvpDeadline
    ? new Date(rsvpDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <section className="py-24 md:py-36 bg-gradient-royal relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--gold-light)) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="container max-w-xl mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1, ease }}
            className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8"
          >
            <Heart className="w-6 h-6 text-gold/60" />
          </motion.div>

          <span className="inline-block font-body text-[10px] tracking-[0.5em] uppercase text-gold-light/40 mb-6">
            We'd love to see you
          </span>
          <h2 className="font-display text-primary-foreground text-4xl md:text-6xl lg:text-7xl mb-6">
            Will you join us?
          </h2>
          <p className="font-elegant text-primary-foreground/50 text-lg md:text-xl mb-4">
            {brideName} & {groomName} would love to celebrate with you
          </p>
          {formattedDeadline && (
            <p className="font-body text-gold-light/40 text-sm mb-8">
              Kindly respond by {formattedDeadline}
            </p>
          )}

          <button
            onClick={() => document.getElementById("rsvp-form")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-3 bg-gradient-gold font-body text-[10px] tracking-[0.3em] uppercase text-secondary-foreground py-4 px-10 rounded-full shadow-gold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            RSVP Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default RsvpSection;
