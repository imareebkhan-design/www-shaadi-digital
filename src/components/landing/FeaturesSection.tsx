import { Link } from "react-router-dom";

const features = [
  { title: "Fully Personalised, No Designer Required", desc: "Choose your palette, typography, and layout. Upload your own photographs. Add a custom melody. Every element of your invitation reflects exactly who you are — and the platform does all the design work for you.", wide: true, dark: false, tag: "Signature Feature", num: "01" },
  { title: "Flawless on Every Screen", desc: "Designed from the ground up for mobile — your invitation renders beautifully on every device, from the latest iPhone to an entry-level Android. No app to download. No zoom required.", wide: false, dark: true, tall: true, platforms: ["iPhone & iOS", "Android (all versions)", "WhatsApp in-app browser", "Desktop & tablet"] },
  { title: "Every Ceremony, One Invitation", desc: "Mehndi, Haldi, Sangeet, Baraat, Reception — each with its own date, time, and venue. One link carries everything.", wide: false, dark: false },
  { title: "Turn-by-Turn Directions", desc: "Embedded maps open directly in Google Maps or Apple Maps. Your guests arrive on time — without a single \"address bhej do\" call.", wide: false, dark: false },
  { title: "Live RSVP Dashboard", desc: "Attendance, dietary notes, and headcounts — all in a real-time dashboard. Your caterer will thank you.", wide: false, dark: false },
  { title: "Automated Reminders", desc: "Guests who haven't responded receive gentle nudges automatically. You stay focused on the celebrations.", wide: false, dark: false },
  { title: "Private by Default", desc: "Your invitation is never public. Password-protect it, share only with your guest list, and edit the details at any time — free of charge.", wide: false, dark: false },
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/[0.12] to-secondary/5 border border-secondary/20 flex items-center justify-center mb-[22px] text-lg">🎨</div>
          <h3 className="font-serif text-xl font-medium mb-2.5 tracking-[0.1px]" style={{ color: "hsl(var(--maroon-dark))" }}>{features[0].title}</h3>
          <p className="text-[13.5px] text-muted-foreground leading-[1.85] font-light">{features[0].desc}</p>
        </div>

        <div className="md:row-span-2 bg-[hsl(var(--maroon-dark))] border-transparent rounded-2xl p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.2)] hover:border-secondary/40 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-secondary/15 border border-secondary/25 flex items-center justify-center mb-[22px] text-lg">📱</div>
          <h3 className="font-serif text-xl font-medium text-white mb-2.5">{features[1].title}</h3>
          <p className="text-[13.5px] text-white/50 leading-[1.85] font-light">{features[1].desc}</p>
          <div className="mt-6 pt-6 border-t border-secondary/15">
            <div className="font-serif text-[13px] text-secondary/60 tracking-[1px] uppercase mb-3">Works on</div>
            <div className="flex flex-col gap-2">
              {(features[1] as any).platforms?.map((p: string) => (
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/[0.12] to-secondary/5 border border-secondary/20 flex items-center justify-center mb-[22px] text-lg">{f.title.includes("Ceremony") ? "📅" : "📍"}</div>
            <h3 className="font-serif text-xl font-medium mb-2.5 tracking-[0.1px]" style={{ color: "hsl(var(--maroon-dark))" }}>{f.title}</h3>
            <p className="text-[13.5px] text-muted-foreground leading-[1.85] font-light">{f.desc}</p>
          </div>
        ))}

        {/* Row 3: three regular cards */}
        {features.slice(4, 7).map((f) => (
          <div key={f.title} className="bg-card border border-secondary/[0.12] rounded-2xl p-9 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(92,26,26,0.08)] hover:border-secondary/30 transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/[0.12] to-secondary/5 border border-secondary/20 flex items-center justify-center mb-[22px] text-lg">{f.title.includes("RSVP") ? "👥" : f.title.includes("Reminder") ? "🔔" : "🔒"}</div>
            <h3 className="font-serif text-xl font-medium mb-2.5 tracking-[0.1px]" style={{ color: "hsl(var(--maroon-dark))" }}>{f.title}</h3>
            <p className="text-[13.5px] text-muted-foreground leading-[1.85] font-light">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
