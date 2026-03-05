import { Link } from "react-router-dom";

const PhoneDemoSection = () => (
  <section className="relative overflow-hidden py-24 px-8 bg-background">
    {/* Ambient glow */}
    <div className="absolute w-[700px] h-[700px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(201,148,26,0.07) 0%, transparent 70%)" }} />

    {/* Scattered dots */}
    {[
      { top: "8%", left: "6%", lg: false },
      { top: "15%", left: "18%", lg: false },
      { top: "22%", right: "14%", lg: true },
      { top: "40%", right: "6%", lg: false },
      { bottom: "25%", left: "10%", lg: true },
      { bottom: "12%", right: "20%", lg: false },
    ].map((d, i) => (
      <div key={i} className={`absolute rounded-full pointer-events-none ${d.lg ? "w-2 h-2 bg-secondary/15" : "w-[5px] h-[5px] bg-secondary/25"}`} style={{ top: d.top, left: d.left, right: (d as any).right, bottom: (d as any).bottom }} />
    ))}
    <div className="absolute font-serif text-[13px] text-secondary/20 pointer-events-none" style={{ top: "12%", left: "32%" }}>♡</div>
    <div className="absolute font-serif text-[13px] text-secondary/20 pointer-events-none" style={{ bottom: "18%", right: "32%" }}>♡</div>

    <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-14">
      {/* Header */}
      <div className="text-center">
        <div className="section-label justify-center">Live Preview</div>
        <h2 className="font-display font-normal leading-[1.15] mt-3" style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "hsl(var(--maroon-dark))" }}>
          Aapka invitation<br /><em className="italic">bilkul aisa dikhega</em>
        </h2>
        <p className="text-[15px] text-muted-foreground mt-2.5 font-light">Scroll karo, tap karo — exactly waise jaise guests dekhenge</p>
      </div>

      {/* Stage: features + phone + stats */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full">
        {/* Left feature pills */}
        <div className="flex flex-row lg:flex-col gap-5 w-full lg:w-[220px] flex-shrink-0 flex-wrap justify-center">
          {[
            { icon: "🛡️", title: "End-to-End Encrypted", desc: "Your guest list & details are fully private and secure." },
            { icon: "💬", title: "WhatsApp Ready", desc: "One tap sends your invite link to every family group instantly." },
            { icon: "⏱️", title: "Live Countdown", desc: "Auto-updating timer builds beautiful anticipation for your day." },
            { icon: "📋", title: "All Ceremonies", desc: "Mehendi, Sangeet, Haldi, Baraat & more — all in one invite." },
          ].map((f) => (
            <div key={f.title} className="bg-white/70 backdrop-blur-sm border border-secondary/[0.18] rounded-2xl p-[18px_20px] flex items-start gap-3.5 shadow-[0_4px_20px_rgba(123,28,46,0.06)] hover:-translate-y-[3px] hover:shadow-[0_10px_32px_rgba(123,28,46,0.1)] transition-all duration-300 w-full lg:w-auto max-w-[280px]">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/20 flex items-center justify-center shrink-0 text-sm">{f.icon}</div>
              <div>
                <h4 className="text-xs font-semibold tracking-[0.2px] mb-1" style={{ color: "hsl(var(--maroon-dark))" }}>{f.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-[1.5] font-light">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* iPhone 17 Pro */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* Glow */}
          <div className="absolute w-[340px] h-[340px] rounded-full -bottom-[60px] left-1/2 -translate-x-1/2 pointer-events-none blur-[30px]" style={{ background: "radial-gradient(circle, rgba(201,148,26,0.18) 0%, transparent 70%)" }} />

          <div className="w-[300px] h-[640px] rounded-[52px] relative" style={{
            background: "linear-gradient(160deg, #8A8178 0%, #6B6058 15%, #7A7068 30%, #5C5248 50%, #7A7068 70%, #6B6058 85%, #8A8178 100%)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 1px rgba(0,0,0,0.3), 0 0 0 3px #1A1410, 0 0 0 4px rgba(255,255,255,0.05), 0 56px 100px rgba(30,10,10,0.45), 0 24px 48px rgba(201,148,26,0.12), 0 4px 12px rgba(0,0,0,0.4)",
          }}>
            {/* Inner bezel */}
            <div className="absolute inset-[3px] rounded-[49px] bg-[#0A0805] overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-0 rounded-[49px] overflow-hidden bg-[#0A0805]">
                <iframe
                  src="https://vivaah-spark-kit.lovable.app/"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  scrolling="yes"
                  className="w-full h-full border-none block rounded-[49px]"
                  style={{ pointerEvents: "auto" }}
                  title="Live invitation preview"
                />
                {/* Dynamic Island */}
                <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[110px] h-8 bg-black rounded-[20px] z-30 flex items-center justify-center gap-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] border border-white/[0.08] relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#0D0D1A]" />
                  </div>
                  <div className="w-[50px] h-1 bg-[#1C1C1C] rounded" />
                </div>
              </div>
            </div>
            {/* Hardware buttons */}
            <div className="absolute -left-[10px] top-[80px] w-[6px] h-7 rounded-[3px]" style={{ background: "linear-gradient(180deg, #7A7068, #5C5248)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
            <div className="absolute -left-[10px] top-[130px] w-[6px] h-9 rounded-[3px]" style={{ background: "linear-gradient(180deg, #7A7068, #5C5248)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
            <div className="absolute -left-[10px] top-[178px] w-[6px] h-9 rounded-[3px]" style={{ background: "linear-gradient(180deg, #7A7068, #5C5248)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
            <div className="absolute -right-[10px] top-[145px] w-[6px] h-14 rounded-[3px]" style={{ background: "linear-gradient(180deg, #7A7068, #5C5248)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        {/* Right stat + feature cards */}
        <div className="flex flex-row lg:flex-col gap-5 w-full lg:w-[220px] shrink-0 flex-wrap justify-center">
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-secondary/[0.22] rounded-2xl px-5 py-3.5 flex items-center gap-2.5 text-[11px] font-medium w-full max-w-[280px]" style={{ color: "hsl(var(--maroon-dark))" }}>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)] shrink-0 animate-pulse" />
            Live RSVP tracking active
          </div>
          {[
            { num: "50K+", label: "Happy Couples" },
            { num: "4.9 ★", label: "Average Rating" },
          ].map((s) => (
            <div key={s.label} className="bg-white/70 backdrop-blur-sm border border-secondary/[0.18] rounded-2xl px-5 py-[18px] text-center shadow-[0_4px_20px_rgba(123,28,46,0.06)] hover:-translate-y-[3px] transition-transform duration-300 w-full max-w-[280px]">
              <div className="font-display text-[28px] font-bold text-primary leading-none mb-1">{s.num}</div>
              <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
          {[
            { icon: "📱", title: "Works on Every Phone", desc: "iPhone, Android, or feature phone — no app install needed." },
            { icon: "✏️", title: "Edit Anytime", desc: "Change venue, time or details — updates live for all guests." },
          ].map((f) => (
            <div key={f.title} className="bg-white/70 backdrop-blur-sm border border-secondary/[0.18] rounded-2xl p-[18px_20px] flex items-start gap-3.5 shadow-[0_4px_20px_rgba(123,28,46,0.06)] hover:-translate-y-[3px] transition-all duration-300 w-full max-w-[280px]">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-secondary/15 to-secondary/5 border border-secondary/20 flex items-center justify-center shrink-0 text-sm">{f.icon}</div>
              <div>
                <h4 className="text-xs font-semibold tracking-[0.2px] mb-1" style={{ color: "hsl(var(--maroon-dark))" }}>{f.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-[1.5] font-light">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link to="/templates" className="relative overflow-hidden inline-block bg-primary text-primary-foreground px-10 py-3.5 text-xs font-semibold tracking-[2px] uppercase hover:bg-[hsl(var(--maroon-dark))] hover:-translate-y-[3px] transition-all duration-300 shadow-[0_8px_32px_rgba(123,28,46,0.28)]">
          Apna Invitation Banao — Free Preview
        </Link>
      </div>
    </div>
  </section>
);

export default PhoneDemoSection;
