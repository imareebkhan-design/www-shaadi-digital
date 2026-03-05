import AnimateIn from "@/components/AnimateIn";

interface Props {
  photos?: string[];
  brideName: string;
  groomName: string;
  isPreview: boolean;
}

const GallerySection = ({ photos, brideName, groomName, isPreview }: Props) => {
  const images = photos && photos.length > 0 ? photos : null;

  if (!images && !isPreview) return null;

  const bentoClasses = [
    "col-span-2 row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-2",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
  ];

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-2xl mx-auto">
        <AnimateIn>
          <div className="text-center mb-10">
            <p className="section-label justify-center">Moments</p>
            <h2 className="section-title">Gallery</h2>
          </div>
        </AnimateIn>

        {images ? (
          <div className="grid grid-cols-3 auto-rows-[140px] md:auto-rows-[180px] gap-2">
            {images.slice(0, 8).map((url, i) => (
              <AnimateIn key={i} delay={i * 0.08} className={`${bentoClasses[i] || "col-span-1 row-span-1"} overflow-hidden`}>
                <img src={url} alt={`${brideName} & ${groomName} - ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              </AnimateIn>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 auto-rows-[140px] gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <AnimateIn key={i} delay={i * 0.08} className={`${bentoClasses[i] || "col-span-1"}`}>
                <div className="w-full h-full bg-muted border border-secondary/10 flex items-center justify-center text-muted-foreground text-xs font-body">
                  Photo {i + 1}
                </div>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
