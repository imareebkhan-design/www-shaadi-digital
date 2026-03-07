import { motion } from "framer-motion";

interface Props {
  brideName: string;
  groomName: string;
  brideFamily: string;
  groomFamily: string;
  brideFullName?: string;
  groomFullName?: string;
  brideBio?: string;
  groomBio?: string;
  photoUrl?: string;
  gradient: string;
  isPreview?: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const CoupleSection = ({
  brideName, groomName, brideFamily, groomFamily,
  brideFullName, groomFullName, brideBio, groomBio,
  photoUrl, isPreview
}: Props) => {
  const displayBrideFullName = brideFullName || (isPreview ? `${brideName} —` : brideName);
  const displayGroomFullName = groomFullName || (isPreview ? `${groomName} —` : groomName);
  const displayBrideBio = brideBio || (isPreview ? "A beautiful soul ready for this journey" : "");
  const displayGroomBio = groomBio || (isPreview ? "A wonderful person beginning this chapter" : "");

  return (
    <section className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Portrait with decorative frame */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, ease }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold/30 rounded-tl-3xl" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/30 rounded-br-3xl" />

            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-elegant">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${brideName} & ${groomName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-6xl">💑</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.4, delay: 0.15, ease }}
          >
            <span className="invite-section-label mb-6 block">With blessings of our families</span>
            <h2 className="font-display text-foreground text-4xl md:text-6xl mb-8 leading-tight">
              Two souls,<br />
              <span className="text-gold-gradient">one journey</span>
            </h2>

            <div className="space-y-8">
              <div className="relative pl-6 border-l-2 border-gold/20">
                <h3 className="font-display text-foreground text-xl md:text-2xl mb-1">{displayBrideFullName}</h3>
                {brideFamily && (
                  <p className="font-elegant text-muted-foreground text-base italic mb-2">
                    {brideFamily}
                  </p>
                )}
                {displayBrideBio && (
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {displayBrideBio}
                  </p>
                )}
              </div>

              <div className="relative pl-6 border-l-2 border-accent/30">
                <h3 className="font-display text-foreground text-xl md:text-2xl mb-1">{displayGroomFullName}</h3>
                {groomFamily && (
                  <p className="font-elegant text-muted-foreground text-base italic mb-2">
                    {groomFamily}
                  </p>
                )}
                {displayGroomBio && (
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {displayGroomBio}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CoupleSection;
