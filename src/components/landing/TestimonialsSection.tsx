import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ananya & Rohit",
    location: "Delhi",
    text: "We had our invite live within 15 minutes. Our NRI relatives in Canada loved it — they RSVP'd the same night!",
    rating: 5,
  },
  {
    name: "Meera & Karthik",
    location: "Chennai",
    text: "The South Indian template was absolutely authentic. It felt like our family's style, not some generic design. Blown away.",
    rating: 5,
  },
  {
    name: "Simran & Harpreet",
    location: "Amritsar",
    text: "My mother created the entire invite herself — she was so proud. The guided wizard made it effortless for her.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section className="section-padding bg-card">
    <div className="container text-center">
      <p className="font-serif italic text-secondary text-base mb-2">Real Couples, Real Love</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        What Our Couples Say
      </h2>
      <div className="gold-divider mb-12" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="border border-border bg-background p-6 text-left hover:border-secondary transition-colors"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
            </div>
            <p className="font-body text-sm text-foreground/90 mb-5 leading-relaxed italic">
              "{t.text}"
            </p>
            <div>
              <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
              <p className="font-body text-xs text-muted-foreground">{t.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
