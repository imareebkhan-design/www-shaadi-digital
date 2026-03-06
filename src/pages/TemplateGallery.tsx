import { useState, useEffect, useRef, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

/* ── FLOATING HEARTS ── */
const HEART_CHARS = ["♡", "♥", "❥", "❣"];

const FloatingHearts = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spawnHeart = () => {
      const h = document.createElement("span");
      h.style.position = "absolute";
      h.style.opacity = "0";
      h.style.userSelect = "none";
      h.style.pointerEvents = "none";
      h.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
      const isMaroon = Math.random() > 0.5;
      h.style.left = `${5 + Math.random() * 90}%`;
      h.style.top = `${10 + Math.random() * 80}%`;
      h.style.fontSize = `${10 + Math.random() * 8}px`;
      h.style.color = isMaroon ? "rgba(92,26,26,.16)" : "rgba(180,100,60,.16)";
      h.style.animation = `heartFloat ${4 + Math.random() * 6}s linear ${Math.random() * 8}s 1`;
      h.style.animationFillMode = "forwards";
      el.appendChild(h);
      setTimeout(() => h.remove(), 14000);
    };

    const initials: NodeJS.Timeout[] = [];
    for (let i = 0; i < 14; i++) initials.push(setTimeout(spawnHeart, i * 600));
    const interval = setInterval(spawnHeart, 2500);

    return () => {
      initials.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};

/* ── SLIDE CARD ── */
interface SlideCardProps {
  totalSlides: number;
  autoPlay?: boolean;
  interval?: number;
  children: React.ReactNode | React.ReactNode[];
}

const SlideCard = ({ totalSlides, autoPlay = false, interval = 2800, children }: SlideCardProps) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    const id = setInterval(() => {
      if (!paused) setCurrent((c) => (c + 1) % totalSlides);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, totalSlides, interval, paused]);

  return (
    <div
      className="card-slides"
      style={{ transform: `translateX(-${current * 100}%)` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {children}
      {totalSlides > 1 && (
        <div className="card-dots">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`card-dot${i === current ? " active" : ""}`}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── COUNTDOWN ── */
const useCountdown = (targetDate: string) => {
  const calc = useCallback(() => {
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hrs: Math.floor((diff % 86400000) / 3600000),
      min: Math.floor((diff % 3600000) / 60000),
    };
  }, [targetDate]);

  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 60000);
    return () => clearInterval(id);
  }, [calc]);
  return time;
};

/* ── MAIN PAGE ── */
const TemplateGallery = () => {
  const navigate = useNavigate();
  const countdown = useCountdown("2025-11-15T21:00:00+05:30");
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen" style={{ background: "#F2EDE4" }}>
      <SEOHead
        title="Wedding Invitation Templates — Shaadi.Digital"
        description="Browse stunning digital wedding invitation templates for Hindu, Muslim, Sikh & South Indian weddings. Choose your style, customise, and share."
        canonical="https://shaadi.digital/templates"
      />
      <Navbar />
      <FloatingHearts />

      {/* heartFloat keyframe */}
      <style>{`
        @keyframes heartFloat {
          0%   { opacity:0; transform:translateY(0) scale(0.6) }
          15%  { opacity:.22 }
          85%  { opacity:.12 }
          100% { opacity:0; transform:translateY(-70px) scale(1) }
        }
        .card-slides {
          display:flex; width:100%; height:100%;
          transition: transform 0.7s cubic-bezier(0.77,0,0.18,1);
          position: relative;
        }
        .card-slide {
          min-width:100%; height:100%;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:20px 14px; text-align:center; position:relative;
        }
        .card-dots {
          position:absolute; bottom:8px; left:50%; transform:translateX(-50%);
          z-index:5; display:flex; gap:5px;
        }
        .card-dot {
          width:5px; height:5px; border-radius:50%;
          background:rgba(255,255,255,0.4); transition:background .3s,transform .3s;
          cursor:pointer; border:none; padding:0;
        }
        .card-dot.active { background:white; transform:scale(1.3); }
      `}</style>

      <main className="relative z-[1] max-w-[1160px] mx-auto px-8 pt-[100px] pb-[100px] max-[560px]:px-4 max-[560px]:pt-[80px]">
        {/* Header */}
        <div className="text-center mb-[52px]">
          <h1 className="font-serif text-[clamp(36px,6vw,64px)] font-normal leading-[1.1]" style={{ color: "#5C1A1A" }}>
            Apna style chuniye,<br />
            <em>ise unique banayein</em>
          </h1>
          <p className="mt-3 text-[15px] font-light" style={{ color: "#8C7B6B", fontFamily: "'DM Sans', sans-serif" }}>
            Har theme aapki love story sunane ke liye design kiya gaya hai
          </p>
        </div>

        {/* ROW 1 — 5 columns */}
        <div className="grid grid-cols-5 gap-3 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
          {/* 1 — Royal Maroon */}
          <Card num={1} badge={<Badge variant="limited">👑 Limited Ed.</Badge>} name="Royal Maroon" tags={["North Indian", "Traditional"]} onClick={() => navigate("/templates/preview/royal-maroon")}>
            <SlideCard totalSlides={3} autoPlay>
              {/* Slide 1: Names + mandala */}
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#3A0512 0%,#6B1428 50%,#3A0512 100%)" }}>
                <div className="absolute inset-0" style={{
                  background: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='90' cy='90' r='85' fill='none' stroke='rgba(201,148,26,0.15)' stroke-width='1'/%3E%3Ccircle cx='90' cy='90' r='65' fill='none' stroke='rgba(201,148,26,0.1)' stroke-width='1'/%3E%3Ccircle cx='90' cy='90' r='45' fill='none' stroke='rgba(201,148,26,0.08)' stroke-width='1'/%3E%3Cline x1='90' y1='5' x2='90' y2='175' stroke='rgba(201,148,26,0.06)' stroke-width='0.5'/%3E%3Cline x1='5' y1='90' x2='175' y2='90' stroke='rgba(201,148,26,0.06)' stroke-width='0.5'/%3E%3C/svg%3E") center/60% no-repeat`,
                  opacity: 1,
                }} />
                <div className="relative z-[1] font-serif text-[20px] font-normal text-white/[.92] leading-[1.25] text-center">
                  Ananya<br /><span className="italic text-[24px]" style={{ color: "#C9941A" }}>&amp;</span><br />Rohan
                </div>
                <div className="relative z-[1] w-10 h-px mx-auto my-2" style={{ background: "rgba(201,148,26,.4)" }} />
                <div className="relative z-[1] text-[8px] tracking-[3px] uppercase" style={{ color: "rgba(201,148,26,.7)" }}>
                  25 · Feb · 2025 · Delhi
                </div>
              </div>

              {/* Slide 2: Countdown */}
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#3A0512,#5C0A1E)" }}>
                <div className="relative z-[1] text-[8px] tracking-[2px] uppercase mb-3" style={{ color: "rgba(201,148,26,.6)" }}>Save the Date</div>
                <div className="relative z-[1] flex gap-1.5">
                  {[{ val: countdown.days, label: "Days" }, { val: countdown.hrs, label: "Hrs" }, { val: countdown.min, label: "Min" }].map((item) => (
                    <div key={item.label} className="flex flex-col items-center px-2 py-1.5 rounded min-w-[38px]" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(201,148,26,.2)" }}>
                      <span className="font-serif text-[22px] leading-none" style={{ color: "#E8C97A" }}>{pad(item.val)}</span>
                      <span className="text-[7px] tracking-[1px] uppercase mt-0.5" style={{ color: "rgba(255,255,255,.35)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide 3: Seal + invite */}
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#280310,#4A0E1C)" }}>
                <div className="relative z-[1] w-[50px] h-[50px] rounded-full flex items-center justify-center text-[22px] mb-2.5" style={{ background: "rgba(201,148,26,.15)", border: "1px solid rgba(201,148,26,.3)" }}>🪔</div>
                <div className="relative z-[1] font-serif text-[11px] italic leading-[1.8] px-2.5" style={{ color: "rgba(255,255,255,.55)" }}>
                  We warmly invite you to celebrate our wedding day with us…
                </div>
              </div>
            </SlideCard>
          </Card>

          {/* 2 — The Theatre */}
          <Card num={2} badge={<Badge variant="new">✦ New</Badge>} name="The Theatre" desc="Elegant design inspired by the drama of the stage" onClick={() => navigate("/templates/preview/royal-maroon")}>
            <SlideCard totalSlides={1}>
              <div className="card-slide overflow-hidden" style={{ background: "#1A0A00" }}>
                <div className="absolute top-0 bottom-0 left-0 w-[45%]" style={{ background: "linear-gradient(180deg,#4A1A00,#2A0800)", borderRadius: "0 0 60% 0", boxShadow: "inset -8px 0 20px rgba(0,0,0,.5)" }} />
                <div className="absolute top-0 bottom-0 right-0 w-[45%]" style={{ background: "linear-gradient(180deg,#4A1A00,#2A0800)", borderRadius: "0 0 0 60%", boxShadow: "inset 8px 0 20px rgba(0,0,0,.5)" }} />
                <div className="relative z-[2] flex flex-col items-center gap-1">
                  <div className="font-serif text-[15px] italic leading-[1.3] text-center" style={{ color: "#F5DEB3" }}>
                    Priya<br />&amp;<br />Arjun
                  </div>
                  <div className="text-[7px] tracking-[2px] uppercase mt-1" style={{ color: "rgba(245,222,179,.4)" }}>Anand Karaj · March 2025</div>
                </div>
              </div>
            </SlideCard>
          </Card>

          {/* 3 — Emerald South */}
          <Card num={3} badge={<Badge variant="location">📍 South Indian ceremony styles</Badge>} name="Emerald South" tags={["South Indian", "Elegant"]} onClick={() => navigate("/templates/preview/emerald-south")}>
            <SlideCard totalSlides={2} autoPlay>
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#0D2818 0%,#1A5C30 60%,#0D2818 100%)" }}>
                {/* Arch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[55%] border border-b-0 rounded-t-[100px]" style={{ borderColor: "rgba(201,148,26,.2)" }} />
                <div className="relative z-[1] flex flex-col items-center">
                  <div className="text-[20px] mb-2 opacity-60">🪷</div>
                  <div className="font-serif text-[17px] text-white/90 text-center leading-[1.3]">
                    Kavya<br /><span className="italic" style={{ color: "#C9941A" }}>&amp;</span><br />Siddharth
                  </div>
                </div>
              </div>
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#0a1e10,#163d22)" }}>
                <div className="relative z-[1] font-serif text-[12px] italic leading-[1.8]" style={{ color: "rgba(255,255,255,.55)" }}>
                  Shubh Vivah · Kalyanam<br />
                  <span className="text-[9px] not-italic" style={{ color: "rgba(201,148,26,.5)" }}>Bangalore · April 2025</span>
                </div>
              </div>
            </SlideCard>
          </Card>

          {/* 4 — Golden Sehra */}
          <Card num={4} name="Golden Sehra" desc="The joy of Anand Karaj, wrapped in saffron and gold" onClick={() => navigate("/templates/preview/golden-punjabi")}>
            <SlideCard totalSlides={1}>
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#2A1800,#6B4000,#2A1800)" }}>
                <div className="relative z-[1] text-[9px] tracking-[1px] mb-2.5" style={{ color: "rgba(255,220,100,.4)" }}>ੴ ਸਤਿ ਨਾਮੁ</div>
                <div className="relative z-[1] text-[34px] opacity-30">☬</div>
                <div className="relative z-[1] font-serif text-[17px] text-center leading-[1.3]" style={{ color: "rgba(255,220,100,.9)" }}>
                  Simran<br />&amp;<br />Harjeet
                </div>
              </div>
            </SlideCard>
          </Card>

          {/* 5 — Pearl Nikah */}
          <Card num={5} name="Pearl Nikah" tags={["Muslim", "Elegant"]} onClick={() => navigate("/templates/preview/pearl-nikah")}>
            <SlideCard totalSlides={1}>
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#0D1A12,#1A3020,#0D1A12)" }}>
                <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(201,148,26,.04) 8px,rgba(201,148,26,.04) 9px)" }} />
                <div className="relative z-[1] text-[9px] tracking-[1px] mb-2" style={{ color: "rgba(201,148,26,.55)" }}>﷽</div>
                <div className="relative z-[1] text-[30px] opacity-30">☪️</div>
                <div className="relative z-[1] font-serif text-[16px] text-white/[.85] text-center leading-[1.3]">
                  Aisha<br />&amp;<br />Zayan
                </div>
              </div>
            </SlideCard>
          </Card>
        </div>

        {/* ROW 2 — 3 columns centered, max-width 60% */}
        <div className="grid grid-cols-3 gap-3 mt-3 mx-auto max-[900px]:grid-cols-2 max-[900px]:max-w-full max-[560px]:grid-cols-1" style={{ maxWidth: "calc(60% + 8px)" }}>
          {/* 6 — Marigold Fest */}
          <Card num={6} name="Marigold Fest" desc="The vibrance of haldi and florals for your celebration" onClick={() => navigate("/templates/preview/saffron-fest")}>
            <SlideCard totalSlides={1}>
              <div className="card-slide" style={{ background: "linear-gradient(160deg,#3D1F00,#A0450A,#3D1F00)" }}>
                <div className="absolute inset-0 flex flex-col justify-between p-2.5 pointer-events-none">
                  <div className="flex justify-between"><span className="text-[22px] opacity-40">🌼</span><span className="text-[22px] opacity-40">🌸</span></div>
                  <div className="flex justify-between"><span className="text-[22px] opacity-40">🌺</span><span className="text-[22px] opacity-40">🌼</span></div>
                </div>
                <div className="relative z-[1] font-serif text-[17px] text-center leading-[1.3]" style={{ color: "rgba(255,230,150,.95)" }}>
                  Meera<br />&amp;<br />Vivek
                </div>
              </div>
            </SlideCard>
          </Card>

          {/* 7 — Ivory Minimal */}
          <Card num={7} numStyle={{ background: "rgba(0,0,0,.08)", color: "#2C1810", borderColor: "rgba(0,0,0,.12)" }} name="Ivory Minimal" tags={["Modern", "Minimal"]} onClick={() => navigate("/templates/preview/ivory-classic")}>
            <SlideCard totalSlides={1}>
              <div className="card-slide" style={{ background: "#F8F4EC" }}>
                <div className="font-serif text-[17px] font-normal text-center leading-[1.4]" style={{ color: "#2C1810" }}>
                  Rhea<br /><span className="italic" style={{ color: "#8C6B4A" }}>&amp;</span><br />Kabir
                </div>
                <div className="w-[30px] h-px mx-auto my-2 opacity-40" style={{ background: "#C9941A" }} />
                <div className="text-[8px] tracking-[3px] uppercase mt-2.5" style={{ color: "#8C7B6B" }}>12 · Oct · 2025 · Mumbai</div>
                <div className="text-[10px] italic leading-[1.6] px-2 mt-1.5" style={{ color: "#8C7B6B" }}>Together with our families, we invite you…</div>
              </div>
            </SlideCard>
          </Card>

          {/* 8 — Coming Soon */}
          <div className="flex flex-col rounded-[18px] overflow-hidden bg-white cursor-default">
            <div className="flex flex-col items-center justify-center gap-2.5" style={{ aspectRatio: "3/4", background: "linear-gradient(160deg,#6B3A3A,#8C5050)" }}>
              <div className="text-[28px] opacity-60">🕐</div>
              <div className="font-serif text-[20px] font-normal" style={{ color: "rgba(255,255,255,.85)" }}>Coming Soon</div>
              <div className="text-[11px] font-light" style={{ color: "rgba(255,255,255,.4)" }}>Naye designs aa rahe hain</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ── CARD WRAPPER ── */
interface CardProps {
  num: number;
  numStyle?: React.CSSProperties;
  badge?: React.ReactNode;
  name: string;
  tags?: string[];
  desc?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Card = ({ num, numStyle, badge, name, tags, desc, onClick, children }: CardProps) => (
  <div
    className="flex flex-col rounded-[18px] overflow-hidden bg-white cursor-pointer transition-all duration-[350ms] hover:-translate-y-1.5 hover:scale-[1.02] hover:z-10"
    style={{ boxShadow: undefined }}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 24px 60px rgba(92,26,26,0.18)")}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    onClick={onClick}
  >
    {/* Preview */}
    <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ aspectRatio: "3/4" }}>
      {children}
      {badge}
      <div
        className="absolute top-2.5 right-2.5 z-[4] w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-medium text-white backdrop-blur-[8px]"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          ...numStyle,
        }}
      >
        {num}
      </div>
    </div>

    {/* Info */}
    <div className="bg-white px-3.5 py-3 flex flex-col gap-[5px]" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
      <div className="font-serif text-[18px] font-medium leading-[1.1]" style={{ color: "#2C1810" }}>{name}</div>
      {tags && (
        <div className="flex items-center gap-1.5">
          {tags.map((tag, i) => (
            <span key={tag}>
              {i > 0 && <span className="inline-block w-0.5 h-0.5 rounded-full mx-1.5 align-middle" style={{ background: "#8C7B6B", opacity: 0.4 }} />}
              <span className="text-[10px] font-light tracking-[0.3px]" style={{ color: "#8C7B6B" }}>{tag}</span>
            </span>
          ))}
        </div>
      )}
      {desc && (
        <div className="text-[11px] font-light leading-[1.45] line-clamp-2" style={{ color: "#8C7B6B" }}>{desc}</div>
      )}
      <button
        className="self-start inline-flex items-center gap-[5px] bg-transparent px-3 py-1.5 rounded-full text-[11px] font-normal mt-0.5 transition-colors duration-200 hover:bg-[rgba(92,26,26,0.06)]"
        style={{ border: "1px solid rgba(92,26,26,0.25)", color: "#5C1A1A" }}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#5C1A1A")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(92,26,26,0.25)")}
      >
        <span className="text-[10px] opacity-70">✦</span> View demo
      </button>
    </div>
  </div>
);

/* ── BADGE ── */
const Badge = ({ variant, children }: { variant: "limited" | "new" | "location"; children: React.ReactNode }) => {
  const styles: Record<string, React.CSSProperties> = {
    limited: { left: 10, background: "rgba(92,26,26,0.85)", color: "#FFCFCF" },
    new: { left: 10, background: "rgba(30,130,60,0.9)", color: "#C8FFD8" },
    location: { left: 10, right: 10, background: "rgba(255,255,255,0.18)", color: "white", fontSize: "9px" },
  };

  return (
    <div
      className="absolute top-2.5 z-[4] flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur-[8px]"
      style={styles[variant]}
    >
      {children}
    </div>
  );
};

export default TemplateGallery;
