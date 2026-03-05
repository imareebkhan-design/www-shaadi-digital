interface Props {
  story?: string;
  isPreview: boolean;
}

const OurStorySection = ({ story, isPreview }: Props) => {
  const text = story?.trim() || (isPreview ? "We met on a rainy evening in Delhi, and from that very first cup of chai together, we knew something beautiful had begun. Through laughter, late-night conversations, and countless adventures, our love story has been nothing short of magical." : null);
  if (!text) return null;

  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-lg mx-auto text-center">
        <p className="section-label justify-center">Our Journey</p>
        <h2 className="section-title mb-8">Our Story</h2>
        <div className="text-secondary text-2xl mb-6">💕</div>
        <p className="font-serif text-lg md:text-xl italic text-foreground/80 leading-relaxed">"{text}"</p>
        <div className="w-12 h-px bg-secondary mx-auto mt-8" />
      </div>
    </section>
  );
};

export default OurStorySection;
