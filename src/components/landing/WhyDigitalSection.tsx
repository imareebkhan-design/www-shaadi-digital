const cards = [
  {
    title: "Instant Delivery via WhatsApp",
    desc: "One link, shared directly to every family group. No app to download, no login required — guests open it and the invitation unfolds beautifully on any device.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    title: "Live RSVP Dashboard",
    desc: "Watch confirmations arrive in real time. Know exactly who is attending, who has declined, and who is yet to respond — before the caterer asks.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Every Ceremony, One Invitation",
    desc: "Mehndi, Haldi, Baraat, Reception — each event carries its own date, time, venue, and directions. Your guests always know exactly where to be.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    ),
  },
  {
    title: "Save ₹10,000 or More",
    desc: "No printing, no postage, no courier delays. Update the venue or timing at any point — at no additional cost, with no reprint required.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
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
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/templates" className="text-[12px] tracking-[1px] uppercase font-medium text-[hsl(var(--gold-light))] hover:underline">Browse templates →</a>
          <span className="text-white/15">|</span>
          <a href="/login" className="text-[12px] tracking-[1px] uppercase font-medium text-white/40 hover:text-[hsl(var(--gold-light))] transition-colors">Already a member? Sign in →</a>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {cards.map((c, i) => (
          <div
            key={c.title}
            className={`bg-white/[0.03] border-l border-secondary/25 border-b border-b-white/[0.04] p-7 grid grid-cols-[48px_1fr] gap-x-5 items-start relative transition-all duration-[350ms] hover:bg-secondary/[0.07] hover:border-l-secondary/60 hover:translate-x-1 cursor-default ${i === 0 ? "rounded-t-lg" : ""} ${i === cards.length - 1 ? "rounded-b-lg !border-b-secondary/15" : ""}`}
          >
            <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
              {c.icon}
            </div>
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
