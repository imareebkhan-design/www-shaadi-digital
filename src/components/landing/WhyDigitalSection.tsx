const cards = [
  { icon: "💬", title: "WhatsApp-Ready Sharing", desc: "One click — share your beautiful invite to all your family groups instantly. Works perfectly on all phones." },
  { icon: "✅", title: "Live RSVP Tracking", desc: "See who's coming, who's not, and who hasn't responded — all in your dashboard, in real time." },
  { icon: "🗺️", title: "Google Maps & Events", desc: "Add Mehndi, Haldi, Baraat, Reception — all with dates, times, venues & directions built in." },
  { icon: "💰", title: "Save ₹10,000+", desc: "Compare to printed invitations: no printing, no postage, no courier. Update for free anytime." },
];

const WhyDigitalSection = () => (
  <section className="section-padding relative overflow-hidden" style={{ background: 'hsl(var(--maroon-dark))' }}>
    <div className="absolute inset-0 cross-pattern" />
    <div className="relative max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
      {/* Left content */}
      <div>
        <div className="section-label !text-secondary/80 before:!bg-secondary/80 after:!bg-secondary/80">Why Digital?</div>
        <h2 className="section-title !text-white">
          Paper Invitations<br />
          ka zamana <em className="italic text-secondary">gaya</em>
        </h2>
        <p className="text-white/65 leading-[1.9] text-[15px] mt-5">
          Paper invitations get lost, can't be updated, and cost thousands. With Shaadi.Digital, send a beautiful personalized link via WhatsApp — your guests RSVP instantly, and you see it all in real time.
        </p>
        <p className="text-white/65 leading-[1.9] text-[15px] mt-3">
          Perfect for NRI families, outstation guests, and anyone who wants a seamless, modern wedding experience without losing the traditional Indian charm. 🪔
        </p>
      </div>

      {/* Right cards */}
      <div className="flex flex-col gap-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="bg-white/5 border border-secondary/20 rounded p-6 transition-all hover:bg-secondary/10 hover:border-secondary/50 hover:translate-x-1.5 cursor-default"
          >
            <div className="text-2xl mb-2.5">{c.icon}</div>
            <h3 className="font-display text-[17px] text-white mb-1.5">{c.title}</h3>
            <p className="text-[13px] text-white/55 leading-[1.7]">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyDigitalSection;
