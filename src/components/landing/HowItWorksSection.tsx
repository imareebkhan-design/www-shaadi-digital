const steps = [
  { num: 1, title: "Choose a Template", desc: "Pick from 200+ stunning designs — traditional, modern, floral, or royal." },
  { num: 2, title: "Add Your Details", desc: "Fill in couple names, event dates, venues, and upload your photos." },
  { num: 3, title: "Preview & Customise", desc: "Preview on mobile, adjust fonts & colors, add your events." },
  { num: 4, title: "Share & Track", desc: "Share on WhatsApp, and watch RSVPs come in on your dashboard." },
];

const HowItWorksSection = () => (
  <section id="how" className="section-padding bg-card">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <div className="section-label justify-center">Simple Process</div>
        <h2 className="section-title text-center">Ready in <em>10 Minutes</em></h2>
        <p className="text-muted-foreground mt-3 text-[14px] md:text-[15px] max-w-[480px] mx-auto leading-[1.8]">
          No design skills needed. No complicated tools. Just <a href="/signup" className="text-primary font-medium hover:underline">sign up free</a>, fill in your details and your invitation is ready.
        </p>
      </div>

      {/* Desktop: 4-col row. Mobile: single column with vertical line */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 relative">
        {/* Connecting line - desktop */}
        <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />
        {/* Connecting line - mobile vertical */}
        <div className="lg:hidden absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent" />

        {steps.map((s) => (
          <div key={s.num} className="text-center relative z-[1]">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[hsl(var(--gold-pale))] border-2 border-secondary flex items-center justify-center mx-auto mb-4 md:mb-5">
              <span className="font-display text-[18px] md:text-[22px] font-bold text-secondary">{s.num}</span>
            </div>
            <h3 className="font-display text-[16px] md:text-[17px] font-semibold mb-2" style={{ color: 'hsl(var(--maroon-dark))' }}>{s.title}</h3>
            <p className="text-[13px] md:text-[13px] text-muted-foreground leading-[1.7]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
