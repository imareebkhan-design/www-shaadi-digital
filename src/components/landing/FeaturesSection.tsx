const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2" />
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#C9941A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const features = [
  { title: "Fully Personalised, No Designer Required", desc: "Choose your palette, typography, and layout. Upload your own photographs. Add a custom melody. Every element of your invitation reflects exactly who you are — and the platform does all the design work for you.", Icon: IconEdit },
  { title: "Flawless on Every Screen", desc: "Designed from the ground up for mobile — your invitation renders beautifully on every device, from the latest iPhone to an entry-level Android. No app to download. No zoom required.", Icon: IconPhone, platforms: ["iPhone & iOS", "Android (all versions)", "WhatsApp in-app browser", "Desktop & tablet"] },
  { title: "Every Ceremony, One Invitation", desc: "Mehndi, Haldi, Sangeet, Baraat, Reception — each with its own date, time, and venue. One link carries everything.", Icon: IconCalendar },
  { title: "Turn-by-Turn Directions", desc: "Embedded maps open directly in Google Maps or Apple Maps. Your guests arrive on time — without a single \"address bhej do\" call.", Icon: IconMap },
  { title: "Live RSVP Dashboard", desc: "Attendance, dietary notes, and headcounts — all in a real-time dashboard. Your caterer will thank you.", Icon: IconUsers },
  { title: "Automated Reminders", desc: "Guests who haven't responded receive gentle nudges automatically. You stay focused on the celebrations.", Icon: IconBell },
  { title: "Private by Default", desc: "Your invitation is never public. Password-protect it, share only with your guest list, and edit the details at any time — free of charge.", Icon: IconShield },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding bg-background relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none" style={{
      background: `radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,148,26,0.06) 0%, transparent 70%),
                   radial-gradient(ellipse 40% 30% at 50% 100%, rgba(201,148,26,0.04) 0%, transparent 70%)`
    }} />

    <div className="relative z-[1] max-w-[1100px] mx-auto">
      <div className="text-center mb-[72px]">
        <div className="section-label justify-center">Everything Included</div>
        <h2 className="section-title text-center">Sab kuch ek jagah,<br /><em>ek price mein</em></h2>
        <p className="text-[15px] text-muted-foreground max-w-[480px] mx-auto mt-4 leading-[1.85] font-light">Every feature your wedding needs — designed together, priced as one.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Row 1: wide card + tall dark card */}
        <div className="md:col-span-2 bg-card border border-secondary/[0.12] rounded-2xl p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(92,26,26,0.08)] hover:border-secondary/30 transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute top-7 right-8 font-serif text-[72px] font-normal text-secondary/[0.07] leading-none pointer-events-none select-none">01</span>
          <span className="inline-flex items-center gap-[5px] bg-secondary/[0.08] border border-secondary/20 text-secondary text-[10px] tracking-[1.2px] uppercase px-2.5 py-1 rounded-full mb-[18px] font-medium">
            <span className="w-2 h-2 rounded-full bg-secondary" /> Signature Feature
          </span>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/[0.12] to-secondary/5 border border-secondary/20 flex items-center justify-center mb-[22px]">
            <IconEdit />
          </div>
          <h3 className="font-serif text-xl font-medium mb-2.5 tracking-[0.1px]" style={{ color: "hsl(var(--maroon-dark))" }}>{features[0].title}</h3>
          <p className="text-[13.5px] text-muted-foreground leading-[1.85] font-light">{features[0].desc}</p>
        </div>

        <div className="md:row-span-2 bg-[hsl(var(--maroon-dark))] border-transparent rounded-2xl p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.2)] hover:border-secondary/40 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center mb-[22px]">
            <IconPhone />
          </div>
          <h3 className="font-serif text-xl font-medium text-white mb-2.5">{features[1].title}</h3>
          <p className="text-[13.5px] text-white/50 leading-[1.85] font-light">{features[1].desc}</p>
          <div className="mt-6 pt-6 border-t border-secondary/15">
            <div className="font-serif text-[13px] text-secondary/60 tracking-[1px] uppercase mb-3">Works on</div>
            <div className="flex flex-col gap-2">
              {features[1].platforms?.map((p) => (
                <div key={p} className="text-xs text-white/40 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-secondary/50" />{p}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: two regular cards */}
        {features.slice(2, 4).map((f) => (
          <div key={f.title} className="bg-card border border-secondary/[0.12] rounded-2xl p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(92,26,26,0.08)] hover:border-secondary/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/[0.12] to-secondary/5 border border-secondary/20 flex items-center justify-center mb-[22px]">
              <f.Icon />
            </div>
            <h3 className="font-serif text-xl font-medium mb-2.5 tracking-[0.1px]" style={{ color: "hsl(var(--maroon-dark))" }}>{f.title}</h3>
            <p className="text-[13.5px] text-muted-foreground leading-[1.85] font-light">{f.desc}</p>
          </div>
        ))}

        {/* Row 3: three regular cards */}
        {features.slice(4, 7).map((f) => (
          <div key={f.title} className="bg-card border border-secondary/[0.12] rounded-2xl p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(92,26,26,0.08)] hover:border-secondary/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/[0.12] to-secondary/5 border border-secondary/20 flex items-center justify-center mb-[22px]">
              <f.Icon />
            </div>
            <h3 className="font-serif text-xl font-medium mb-2.5 tracking-[0.1px]" style={{ color: "hsl(var(--maroon-dark))" }}>{f.title}</h3>
            <p className="text-[13.5px] text-muted-foreground leading-[1.85] font-light">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
