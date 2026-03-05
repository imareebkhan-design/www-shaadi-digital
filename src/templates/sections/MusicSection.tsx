interface Props {
  musicUrl?: string;
  isPreview: boolean;
}

const MusicSection = ({ musicUrl, isPreview }: Props) => {
  if (!musicUrl && !isPreview) return null;

  // Convert Spotify URL to embed URL
  const getEmbedUrl = (url: string): string | null => {
    try {
      if (url.includes("spotify.com")) {
        // https://open.spotify.com/playlist/xxx → https://open.spotify.com/embed/playlist/xxx
        return url.replace("spotify.com/", "spotify.com/embed/") + "?theme=0";
      }
      return url;
    } catch {
      return null;
    }
  };

  const embedUrl = musicUrl ? getEmbedUrl(musicUrl) : null;

  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-md mx-auto text-center">
        <p className="section-label justify-center">Set the Mood</p>
        <h2 className="section-title mb-8">Our Playlist</h2>
        {embedUrl ? (
          <div className="w-full overflow-hidden border border-secondary/20">
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
          <div className="w-full h-[200px] bg-muted border border-secondary/10 flex items-center justify-center text-muted-foreground text-sm font-body">
            🎵 Spotify Playlist Embed
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default MusicSection;
