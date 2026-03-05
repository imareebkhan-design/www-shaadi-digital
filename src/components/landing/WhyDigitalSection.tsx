const cards = [
  { icon: "💬", title: "Instant Delivery via WhatsApp", desc: "One link, shared directly to every family group. No app to download, no login required — guests open it and the invitation unfolds beautifully on any device." },
  { icon: "👥", title: "Live RSVP Dashboard", desc: "Watch confirmations arrive in real time. Know exactly who is attending, who has declined, and who is yet to respond — before the caterer asks." },
  { icon: "📍", title: "Every Ceremony, One Invitation", desc: "Mehndi, Haldi, Baraat, Reception — each event carries its own date, time, venue, and directions. Your guests always know exactly where to be." },
  { icon: "💰", title: "Save ₹10,000 or More", desc: "No printing, no postage, no courier delays. Update the venue or timing at any point — at no additional cost, with no reprint required." },
];

const WhyDigitalSection = () => (
  <section className="section-padding relative overflow-hidden" style={{ background: "hsl(var(--maroon-dark))" }}>
    {/* Radial glows */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: `radial-gradient(ellipse 70% 60% at 15% 50%, rgba(201,148,26,0.07) 0%, transparent 70%),
                   radial-gradient(ellipse 50% 80% at 85% 50%, rgba(92,26,26,0.5) 0%, transparent 70%)`
    }} />
    {/* Dot grid */}
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "radial-gradient(circle, rgba(201,148,26,0.12) 1px, transparent 1px)",
      backgroundSize: "28px 28px",
      maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
    }} />

    <div className="relative z-[1] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
      <div>
        <div className="section-label !text-[hsl(var(--gold-light))] before:!bg-[hsl(var(--gold-light))] after:!bg-[hsl(var(--gold-light))]">Why Digital?</div>
        <h2 className="section-title !text-white">
          Paper invitations<br />ka zamana <em className="italic !text-secondary">gaya</em>
        </h2>
        <div className="w-12 h-px bg-gradient-to-r from-secondary to-transparent my-7" />
        <p className="text-white/70 leading-[1.95] text-[15px] font-light">
          Printed cards get lost in transit, cannot be corrected once dispatched, and cost far more than the occasion deserves. Shaadi.Digital replaces all of that — a single elegant link, delivered in seconds, experienced on any phone.
        </p>
        <p className="text-secondary/60 text-base mt-4 leading-[1.8] italic font-serif">
          Crafted for NRI families, outstation guests, and couples who want every detail of their celebration to feel considered.
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        {cards.map((c, i) => (
          <div
            key={c.title}
            className={`bg-white/[0.03] border-l border-secondary/25 border-b border-b-white/[0.04] p-7 grid grid-cols-[48px_1fr] gap-x-5 items-start relative transition-all duration-[350ms] hover:bg-secondary/[0.07] hover:border-l-secondary/60 hover:translate-x-1 cursor-default ${i === 0 ? "rounded-t-lg" : ""} ${i === cards.length - 1 ? "rounded-b-lg !border-b-secondary/15" : ""}`}
          >
            <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 mt-0.5 text-lg">{c.icon}</div>
            <div>
              <h3 className="font-serif text-[18px] font-medium text-white mb-1.5 tracking-[0.2px]">{c.title}</h3>
              <p className="text-[13px] text-white/[0.48] leading-[1.75] font-light">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyDigitalSection;
