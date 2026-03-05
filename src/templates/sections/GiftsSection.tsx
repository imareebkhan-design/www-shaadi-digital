import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  upiId?: string;
  giftRegistryUrl?: string;
  brideName: string;
  groomName: string;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const GiftsSection = ({ upiId, giftRegistryUrl, brideName, groomName }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!upiId && !giftRegistryUrl) return null;

  const copyUpi = async () => {
    if (!upiId) return;
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="container max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
        >
          <span className="invite-section-label mb-6 block">Blessings & Gifts</span>
          <h2 className="invite-section-title mb-4">Gifts</h2>
          <p className="font-elegant text-lg italic text-foreground/70 leading-relaxed mb-10">
            Your presence is our greatest gift.
          </p>

          <div className="space-y-5">
            {upiId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 1, ease }}
                className="bg-card rounded-2xl p-6 gold-border shadow-card-wedding"
              >
                <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-4">UPI Payment</p>
                <div
                  onClick={copyUpi}
                  className="flex items-center justify-center gap-3 bg-muted/50 border border-border px-5 py-3 rounded-xl cursor-pointer hover:border-gold/40 transition-colors group"
                >
                  <span className="font-body text-sm font-medium text-foreground select-all">{upiId}</span>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-gold shrink-0 transition-colors" />
                  )}
                </div>
                <a
                  href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(`${brideName} & ${groomName}`)}`}
                  className="inline-flex items-center gap-2 mt-4 font-body text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-dark transition-colors"
                >
                  <Gift className="w-3.5 h-3.5" /> Pay via UPI App
                </a>
              </motion.div>
            )}

            {giftRegistryUrl && (
              <motion.a
                href={giftRegistryUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 1, ease }}
                className="flex items-center justify-center gap-2 bg-gradient-gold font-body text-[10px] tracking-[0.3em] uppercase text-secondary-foreground py-4 px-8 rounded-full shadow-gold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                View Gift Registry <ExternalLink className="w-3.5 h-3.5" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftsSection;
