import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import AnimateIn from "@/components/AnimateIn";

interface Props {
  photos?: string[];
  brideName: string;
  groomName: string;
  isPreview: boolean;
}

const GallerySection = ({ photos, brideName, groomName, isPreview }: Props) => {
  const images = photos && photos.length > 0 ? photos : null;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  const displayImages = images?.slice(0, 8) || [];

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
            {displayImages.map((url, i) => (
              <AnimateIn key={i} delay={i * 0.08} className={`${bentoClasses[i] || "col-span-1 row-span-1"} overflow-hidden cursor-pointer`}>
                <img
                  src={url}
                  alt={`${brideName} & ${groomName} - ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onClick={() => setLightboxIndex(i)}
                />
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

      {/* Lightbox */}
      {lightboxIndex !== null && images && (
        <Lightbox
          images={displayImages}
          currentIndex={lightboxIndex}
          alt={`${brideName} & ${groomName}`}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
};

/* ── Lightbox sub-component ── */

interface LightboxProps {
  images: string[];
  currentIndex: number;
  alt: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox = ({ images, currentIndex, alt, onClose, onNavigate }: LightboxProps) => {
  const prev = useCallback(() => onNavigate((currentIndex - 1 + images.length) % images.length), [currentIndex, images.length, onNavigate]);
  const next = useCallback(() => onNavigate((currentIndex + 1) % images.length), [currentIndex, images.length, onNavigate]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", animation: "lightbox-fade-in 0.3s ease" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10">
        <X className="w-7 h-7" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Image */}
      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt={`${alt} - ${currentIndex + 1}`}
        className="max-w-[90vw] max-h-[85vh] object-contain select-none"
        style={{ animation: "lightbox-fade-in 0.3s ease" }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-body tracking-widest">
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  );
};

export default GallerySection;
