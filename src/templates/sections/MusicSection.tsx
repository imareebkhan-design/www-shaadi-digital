import { motion } from "framer-motion";

interface Props {
  musicUrl?: string;
  isPreview: boolean;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const MusicSection = ({ musicUrl, isPreview }: Props) => {
  if (!musicUrl && !isPreview) return null;

  const getEmbedUrl = (url: string): string | null => {
    try {
      if (url.includes("spotify.com")) {
        return url.replace("spotify.com/", "spotify.com/embed/") + "?theme=0";
      }
      return url;
    } catch {
      return null;
    }
  };

  const embedUrl = musicUrl ? getEmbedUrl(musicUrl) : null;

  return (
    <section className="py-24 md:py-36 bg-card relative overflow-hidden">
      <div className="container max-w-xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
        >
          <span className="invite-section-label mb-6 block">Set the Mood</span>
          <h2 className="invite-section-title mb-10">Our Playlist</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
        >
          {embedUrl ? (
            <div className="w-full overflow-hidden rounded-2xl gold-border shadow-card-wedding">
              <iframe
                src={embedUrl}
                width="100%"
                height="352"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Wedding Playlist"
                style={{ border: 0 }}
              />
            </div>
          ) : isPreview ? (
            <div className="w-full h-[200px] bg-muted/50 gold-border rounded-2xl flex items-center justify-center text-muted-foreground text-sm font-body">
              🎵 Spotify Playlist Embed
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
};

export default MusicSection;
