import { Gift } from "lucide-react";

interface Props {
  upiId?: string;
  giftRegistryUrl?: string;
  brideName: string;
  groomName: string;
}

const GiftsSection = ({ upiId, giftRegistryUrl, brideName, groomName }: Props) => {
  if (!upiId && !giftRegistryUrl) return null;

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-md mx-auto text-center">
        <p className="section-label justify-center">Blessings & Gifts</p>
        <h2 className="section-title mb-4">Gift the Couple</h2>
        <p className="text-sm text-muted-foreground mb-8">Your presence is the greatest gift. But if you wish to bless {brideName} & {groomName}:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {upiId && (
            <a href={`upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(`${brideName} & ${groomName}`)}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-xs font-medium tracking-[1px] uppercase hover:bg-primary/90 transition-colors">
              <Gift className="w-4 h-4" /> Send Gift (UPI)
            </a>
          )}
          {giftRegistryUrl && (
            <a href={giftRegistryUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3.5 text-xs font-medium tracking-[1px] uppercase hover:bg-primary/5 transition-colors">
              <Gift className="w-4 h-4" /> Gift Registry
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default GiftsSection;
