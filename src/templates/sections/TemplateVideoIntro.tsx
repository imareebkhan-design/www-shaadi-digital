import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface TemplateVideoIntroProps {
  videoUrl?: string;
  onComplete: () => void;
  brideName: string;
  groomName: string;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const TemplateVideoIntro = ({ videoUrl, onComplete, brideName, groomName }: TemplateVideoIntroProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    };

    video.addEventListener("ended", handleEnded);
    
    // Auto-play the video
    video.play().catch((err) => {
      console.log("Auto-play prevented:", err);
    });

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 800);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ backgroundColor: "hsl(var(--template-bg, var(--burgundy)))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {/* Video player */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
            preload="auto"
            poster={undefined}
            src={videoUrl || "/api/placeholder/1920/1080"}
          />

          {/* Skip button */}
          <motion.button
            onClick={handleSkip}
            className="absolute top-6 right-6 z-[110] flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
            Skip
          </motion.button>

          {/* Subtle label */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="font-display text-white/90 text-lg md:text-xl">
              {brideName} & {groomName}
            </p>
            <p className="font-body text-white/60 text-xs tracking-[0.3em] uppercase mt-1">
              Preview
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateVideoIntro;
