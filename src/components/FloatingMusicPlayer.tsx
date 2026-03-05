import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  musicUrl?: string;
}

const FloatingMusicPlayer = ({ musicUrl }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!musicUrl) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [musicUrl]);

  if (!musicUrl) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label={playing ? "Mute music" : "Play music"}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-foreground/60 backdrop-blur-sm text-lg transition-transform hover:scale-110 active:scale-95"
    >
      {playing && (
        <span className="absolute inset-0 rounded-full border-2 border-secondary animate-music-pulse" />
      )}
      <span className="relative z-10">{playing ? "🎵" : "🔇"}</span>
    </motion.button>
  );
};

export default FloatingMusicPlayer;
