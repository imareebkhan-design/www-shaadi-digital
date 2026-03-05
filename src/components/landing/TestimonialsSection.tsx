const testimonials = [
  {
    text: '"Humari family Bombay, Delhi aur US mein hai — sabne invite ek minute mein dekha aur RSVP bhi kiya. Bahut easy tha!"',
    name: "Ritu & Sameer Sharma",
    location: "Delhi NCR · Nov 2024",
    initial: "R",
  },
  {
    text: '"The templates are so beautiful! Meri friends pooch rahi thi — \'ye invite kisne design kiya?\' Super happy with Shaadi.Digital."',
    name: "Priyanka Nair",
    location: "Kochi · Dec 2024",
    initial: "P",
  },
  {
    text: '"Venue last minute change hua — 2 minute mein update kar diya. Sab guests ko automatically new address mil gaya. Life saver!"',
    name: "Arjun & Kavitha",
    location: "Bangalore · Jan 2025",
    initial: "A",
  },
];

const TestimonialsSection = () => (
  <section className="section-padding bg-[hsl(var(--gold-pale))] relative overflow-hidden">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-14">
        <div className="section-label justify-center">Love Stories</div>
        <h2 className="section-title text-center">Hazaron couples ne<br /><em>humein choose kiya</em></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-card rounded p-8 border border-secondary/15 transition-shadow hover:shadow-[0_12px_40px_hsl(var(--secondary)/0.12)]"
          >
            <div className="text-secondary text-sm tracking-[2px] mb-3.5">★★★★★</div>
            <p className="font-serif text-[17px] italic leading-[1.7] text-foreground mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className="w-[42px] h-[42px] rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-base">
                {t.initial}
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
