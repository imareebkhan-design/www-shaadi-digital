import { Link } from "react-router-dom";

const CTABanner = () => (
  <section className="relative overflow-hidden text-center py-[120px] px-10" style={{ background: "hsl(var(--maroon-dark))" }}>
    {/* Mandala rings */}
    <div className="absolute w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{
      background: "radial-gradient(circle, rgba(201,148,26,0.06) 0%, transparent 70%)",
      border: "1px solid rgba(201,148,26,0.08)",
      boxShadow: "0 0 0 60px rgba(201,148,26,0.03), 0 0 0 120px rgba(201,148,26,0.02), 0 0 0 180px rgba(201,148,26,0.015)",
    }} />
    <div className="absolute inset-0 pointer-events-none" style={{
      background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,148,26,0.05) 0%, transparent 60%),
                   linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.15) 100%)`,
    }} />

    <div className="relative z-[1] max-w-[700px] mx-auto">
      <div className="section-label justify-center !text-[hsl(var(--gold-light))] before:!bg-[hsl(var(--gold-light))] after:!bg-[hsl(var(--gold-light))]">Begin Your Story</div>
      <h2 className="font-display font-bold text-white leading-[1.15] my-4" style={{ fontSize: "clamp(32px, 5vw, 62px)" }}>
        Woh invitation jo<br />sab yaad <em className="italic text-[hsl(var(--gold-light))]">rakhein</em>
      </h2>
      <p className="text-[15px] text-white/50 max-w-[440px] mx-auto mb-10 leading-[1.85] font-light">
        50,000+ couples ne apni shaadi ko Shaadi.Digital ke saath aur bhi khaas banaya. Ab aapki baari hai — preview bilkul free hai.
      </p>

      <div className="flex flex-col items-center gap-4">
        <Link to="/templates" className="inline-flex items-center gap-2.5 bg-gradient-to-br from-secondary to-[#E8B84B] font-bold text-[11px] tracking-[2px] uppercase px-[52px] py-[18px] rounded-full shadow-[0_12px_40px_rgba(201,148,26,0.35)] hover:shadow-[0_20px_60px_rgba(201,148,26,0.5)] hover:-translate-y-0.5 transition-all duration-300" style={{ color: "hsl(var(--maroon-dark))" }}>
          ❤️ Free Preview — No Card Needed
        </Link>
        <a href="#templates" className="inline-flex items-center gap-2 text-white/50 text-xs hover:text-[hsl(var(--gold-light))] transition-colors">
          🔲 Browse all templates first
        </a>
      </div>

      <div className="flex items-center justify-center gap-5 mt-12 flex-wrap">
        {[
          { icon: "🛡️", text: "100% secure" },
          { icon: "⏱️", text: "Ready in 10 minutes" },
          { icon: "💰", text: "Pay only when you love it" },
          { icon: "♾️", text: "Updates free forever" },
        ].map((t, i) => (
          <div key={t.text} className="flex items-center gap-0">
            {i > 0 && <div className="w-px h-3 bg-white/10 mr-5" />}
            <div className="flex items-center gap-1.5 text-[11px] text-white/30 tracking-[0.3px]">
              <span className="text-secondary/50 text-xs">{t.icon}</span> {t.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CTABanner;
