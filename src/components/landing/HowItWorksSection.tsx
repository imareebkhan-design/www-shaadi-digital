const steps = [
  { num: 1, title: "Choose a Template", desc: "Pick from 200+ stunning designs — traditional, modern, floral, or royal." },
  { num: 2, title: "Add Your Details", desc: "Fill in couple names, event dates, venues, and upload your photos." },
  { num: 3, title: "Preview & Customise", desc: "Preview on mobile, adjust fonts & colors, add your events." },
  { num: 4, title: "Share & Track", desc: "Share on WhatsApp, and watch RSVPs come in on your dashboard." },
];

const HowItWorksSection = () => (
  <section id="how" className="section-padding bg-card">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-16">
        <div className="section-label justify-center">Simple Process</div>
        <h2 className="section-title text-center">Ready in <em>10 Minutes</em></h2>
        <p className="text-muted-foreground mt-3 text-[15px] max-w-[480px] mx-auto leading-[1.8]">
          No design skills needed. No complicated tools. Just <a href="/signup" className="text-primary font-medium hover:underline">sign up free</a>, fill in your details and your invitation is ready.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connecting line */}
        <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-secondary to-transparent" />

        {steps.map((s) => (
          <div key={s.num} className="text-center relative">
            <div className="w-16 h-16 rounded-full bg-[hsl(var(--gold-pale))] border-2 border-secondary flex items-center justify-center mx-auto mb-5">
              <span className="font-display text-[22px] font-bold text-secondary">{s.num}</span>
            </div>
            <h3 className="font-display text-[17px] font-semibold mb-2" style={{ color: 'hsl(var(--maroon-dark))' }}>{s.title}</h3>
            <p className="text-[13px] text-muted-foreground leading-[1.7]">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
