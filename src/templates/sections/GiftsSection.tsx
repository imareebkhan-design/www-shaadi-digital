import { useState } from "react";
import { Gift, Copy, Check, ExternalLink } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

interface Props {
  upiId?: string;
  giftRegistryUrl?: string;
  brideName: string;
  groomName: string;
}

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
    <section className="py-16 px-6 bg-background">
      <AnimateIn>
        <div className="max-w-md mx-auto text-center">
          <p className="section-label justify-center">Blessings & Gifts</p>
          <h2 className="section-title mb-4">Gifts</h2>
          <p className="font-serif text-base italic text-foreground/70 leading-relaxed mb-8">
            Your presence is our greatest gift.
          </p>

          <div className="space-y-4">
            {upiId && (
              <div className="border border-secondary/20 bg-card p-5">
                <p className="font-body text-xs tracking-[2px] uppercase text-muted-foreground mb-3">UPI</p>
                <div
                  onClick={copyUpi}
                  className="flex items-center justify-center gap-3 bg-muted/50 border border-border px-5 py-3 cursor-pointer hover:border-secondary/40 transition-colors group"
                >
                  <span className="font-body text-sm font-medium text-foreground select-all">{upiId}</span>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-secondary shrink-0 transition-colors" />
                  )}
                </div>
                <a
                  href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(`${brideName} & ${groomName}`)}`}
                  className="inline-flex items-center gap-2 mt-3 text-xs font-medium text-secondary hover:text-primary transition-colors uppercase tracking-[0.5px]"
                >
                  <Gift className="w-3.5 h-3.5" /> Pay via UPI App
                </a>
              </div>
            )}

            {giftRegistryUrl && (
              <a
                href={giftRegistryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3.5 text-xs font-medium tracking-[1px] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                View Gift Registry <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </AnimateIn>
    </section>
  );
};

export default GiftsSection;
