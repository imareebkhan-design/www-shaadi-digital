import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  photos?: string[];
  brideName: string;
  groomName: string;
  isPreview: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const GallerySection = ({ photos, brideName, groomName, isPreview }: Props) => {
  const images = photos && photos.length > 0 ? photos : null;
  const [selected, setSelected] = useState<number | null>(null);

  if (!images && !isPreview) return null;

  const displayImages = images?.slice(0, 8) || [];

  const navigate = (dir: number) => {
    if (selected === null) return;
    setSelected((selected + dir + displayImages.length) % displayImages.length);
  };

  return (
    <section className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
          className="text-center mb-16"
        >
          <span className="invite-section-label mb-6 block">Captured moments</span>
          <h2 className="invite-section-title">Gallery</h2>
        </motion.div>

        {images ? (
          <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {displayImages.map((url, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.12, ease }}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer group relative"
                onClick={() => setSelected(i)}
              >
                <img
                  src={url}
                  alt={`${brideName} & ${groomName} - ${i + 1}`}
                  className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.12, ease }}
                className="break-inside-avoid rounded-xl overflow-hidden"
              >
                <div className={`w-full bg-muted/50 gold-border flex items-center justify-center text-muted-foreground text-xs font-body ${i % 3 === 0 ? "h-64" : "h-48"}`}>
                  Photo {i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Lightbox */}
      <AnimatePresence>
        {selected !== null && images && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                  className="absolute left-4 md:left-8 z-10 w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(1); }}
                  className="absolute right-4 md:right-8 z-10 w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/80 hover:bg-primary-foreground/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <motion.img
              key={selected}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              src={displayImages[selected]}
              alt={`${brideName} & ${groomName} - ${selected + 1}`}
              className="max-w-[90vw] max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-xs text-primary-foreground/40 tracking-widest">
              {selected + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
