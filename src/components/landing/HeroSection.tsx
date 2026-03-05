import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const MandalaLarge = () => (
  <svg className="absolute pointer-events-none w-[700px] h-[700px] -top-[200px] -right-[180px] opacity-[0.055]" style={{ animation: "spin 80s linear infinite" }} viewBox="0 0 500 500" fill="none">
    <circle cx="250" cy="250" r="240" stroke="hsl(var(--secondary))" strokeWidth="1" />
    <circle cx="250" cy="250" r="200" stroke="hsl(var(--secondary))" strokeWidth="0.5" />
    <circle cx="250" cy="250" r="160" stroke="hsl(var(--secondary))" strokeWidth="1" />
    <circle cx="250" cy="250" r="120" stroke="hsl(var(--secondary))" strokeWidth="0.5" />
    <circle cx="250" cy="250" r="80" stroke="hsl(var(--secondary))" strokeWidth="1" />
    <g stroke="hsl(var(--secondary))" strokeWidth="0.5">
      <line x1="250" y1="10" x2="250" y2="490" />
      <line x1="10" y1="250" x2="490" y2="250" />
      <line x1="80" y1="80" x2="420" y2="420" />
      <line x1="420" y1="80" x2="80" y2="420" />
    </g>
    <polygon points="250,10 257,50 250,60 243,50" fill="#C9941A" opacity="0.6" />
    <polygon points="250,490 257,450 250,440 243,450" fill="#C9941A" opacity="0.6" />
    <polygon points="10,250 50,257 60,250 50,243" fill="#C9941A" opacity="0.6" />
    <polygon points="490,250 450,257 440,250 450,243" fill="#C9941A" opacity="0.6" />
  </svg>
);

const MandalaSmall = () => (
  <svg className="absolute pointer-events-none w-[480px] h-[480px] -bottom-[130px] -left-[120px] opacity-[0.04]" style={{ animation: "spin 100s linear infinite reverse" }} viewBox="0 0 400 400" fill="none">
    <circle cx="200" cy="200" r="190" stroke="hsl(var(--primary))" strokeWidth="0.8" />
    <circle cx="200" cy="200" r="155" stroke="hsl(var(--primary))" strokeWidth="0.4" />
    <circle cx="200" cy="200" r="120" stroke="hsl(var(--primary))" strokeWidth="0.8" />
    <circle cx="200" cy="200" r="85" stroke="hsl(var(--primary))" strokeWidth="0.4" />
    <g stroke="hsl(var(--primary))" strokeWidth="0.4">
      <line x1="200" y1="10" x2="200" y2="390" />
      <line x1="10" y1="200" x2="390" y2="200" />
      <line x1="55" y1="55" x2="345" y2="345" />
      <line x1="345" y1="55" x2="55" y2="345" />
    </g>
  </svg>
);

const MandalaCenter = () => (
  <svg className="absolute pointer-events-none w-[900px] h-[900px] top-1/2 left-1/2 opacity-[0.025]" style={{ animation: "spin3 120s linear infinite" }} viewBox="0 0 600 600" fill="none">
    <circle cx="300" cy="300" r="290" stroke="#C9941A" strokeWidth="0.5" />
    <circle cx="300" cy="300" r="240" stroke="#C9941A" strokeWidth="0.3" />
    <circle cx="300" cy="300" r="190" stroke="#C9941A" strokeWidth="0.5" />
    <circle cx="300" cy="300" r="140" stroke="#C9941A" strokeWidth="0.3" />
    <g stroke="#C9941A" strokeWidth="0.3" opacity="0.5">
      <line x1="300" y1="10" x2="300" y2="590" />
      <line x1="10" y1="300" x2="590" y2="300" />
      <line x1="90" y1="90" x2="510" y2="510" />
      <line x1="510" y1="90" x2="90" y2="510" />
      <line x1="195" y1="10" x2="405" y2="590" />
      <line x1="10" y1="195" x2="590" y2="405" />
      <line x1="405" y1="10" x2="195" y2="590" />
      <line x1="10" y1="405" x2="590" y2="195" />
    </g>
  </svg>
);

const particles = [
  { w: 6, top: "18%", left: "12%", dur: "14s", del: "0s", op: 0.35 },
  { w: 4, top: "35%", left: "22%", dur: "18s", del: "3s", op: 0.2 },
  { w: 8, top: "60%", right: "15%", dur: "12s", del: "1s", op: 0.25 },
  { w: 5, top: "45%", right: "28%", dur: "16s", del: "5s", op: 0.15 },
  { w: 3, top: "25%", right: "35%", dur: "20s", del: "7s", op: 0.3 },
  { w: 7, top: "75%", left: "30%", dur: "15s", del: "2s", op: 0.2 },
  { w: 4, top: "12%", left: "55%", dur: "22s", del: "4s", op: 0.18 },
  { w: 5, top: "80%", right: "45%", dur: "17s", del: "6s", op: 0.22 },
];

const LINE1 = "Aapki Shaadi";
const LINE2 = "Aapka Andaaz";
const BASE_SPEED = 95;
const JITTER = 28;
const SPACE_PAUSE = 160;

const HeroSection = () => {
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [cursor1Active, setCursor1Active] = useState(false);
  const [cursor2Active, setCursor2Active] = useState(false);
  const [cursor2FadeOut, setCursor2FadeOut] = useState(false);
  const [ornamentVisible, setOrnamentVisible] = useState(false);
  const [emVisible, setEmVisible] = useState(false);
  const [lineAnimate, setLineAnimate] = useState(false);
  const [subtextVisible, setSubtextVisible] = useState(false);
  const [descVisible, setDescVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    let i = 0;
    const typeChar = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, onDone: () => void) => {
      let ci = 0;
      const tick = () => {
        ci++;
        setter(text.slice(0, ci));
        if (ci >= text.length) {
          addTimer(onDone, 520);
          return;
        }
        const ch = text[ci] || "";
        const delay = BASE_SPEED + (Math.random() * JITTER * 2 - JITTER) + (ch === " " ? SPACE_PAUSE : 0);
        addTimer(tick, Math.max(40, delay));
      };
      addTimer(tick, 0);
    };

    addTimer(() => {
      setCursor1Active(true);
      typeChar(LINE1, setLine1Text, () => {
        setOrnamentVisible(true);
        setCursor1Active(false);
        setEmVisible(true);
        addTimer(() => {
          setCursor2Active(true);
          typeChar(LINE2, setLine2Text, () => {
            addTimer(() => {
              setCursor2Active(false);
              setCursor2FadeOut(true);
            }, 900);
            addTimer(() => setLineAnimate(true), 300);
            addTimer(() => setSubtextVisible(true), 500);
            addTimer(() => setDescVisible(true), 850);
            addTimer(() => setActionsVisible(true), 1150);
            addTimer(() => setStatsVisible(true), 1450);
            addTimer(() => setScrollVisible(true), 2500);
          });
        }, 120);
      });
    }, 700);

    return clearTimers;
  }, [addTimer, clearTimers]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-5 pt-[120px] pb-20" style={{ background: "#F5EFE4" }}>
      {/* Layered background */}
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 90% 70% at 50% -10%, rgba(201,148,26,0.13) 0%, transparent 65%),
                     radial-gradient(ellipse 50% 40% at 8% 85%, rgba(123,28,46,0.07) 0%, transparent 55%),
                     radial-gradient(ellipse 40% 30% at 92% 80%, rgba(201,148,26,0.05) 0%, transparent 55%),
                     linear-gradient(180deg, #F8F2E8 0%, #F0E8D8 100%)`
      }} />

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.018]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "180px",
      }} />

      <MandalaLarge />
      <MandalaSmall />
      <MandalaCenter />

      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.w, height: p.w,
            top: p.top, left: p.left, right: (p as any).right,
            background: `radial-gradient(circle, rgba(201,148,26,0.5) 0%, transparent 70%)`,
            animation: `floatP ${p.dur} ease-in-out infinite`,
            animationDelay: p.del,
            opacity: p.op,
          }}
        />
      ))}

      {/* Badge */}
      <div className="relative z-[2] inline-flex items-center gap-2.5 bg-[rgba(201,148,26,0.08)] border border-secondary/30 backdrop-blur-sm px-5 py-[7px] rounded-full text-[10px] font-medium tracking-[2px] uppercase text-secondary mb-9 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.2s_forwards]">
        <span className="w-[5px] h-[5px] rounded-full bg-secondary animate-pulse" />
        India's Most Beautiful Digital Invitations
        <span className="w-[5px] h-[5px] rounded-full bg-secondary animate-pulse" />
      </div>

      {/* Typewriter Headline */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-center min-h-[220px]">
        <div className="text-center" style={{ opacity: 1 }}>
          <h1 className="font-display font-bold leading-[1.22]" style={{ fontSize: "clamp(40px, 6.5vw, 82px)", color: "hsl(var(--maroon-dark))" }}>
            <span>{line1Text}</span>
            {cursor1Active && (
              <span className="inline-block w-[2.5px] bg-secondary rounded-sm ml-[3px] align-middle relative -top-[0.06em] animate-[twBlink_1.05s_step-start_infinite]" style={{ height: "0.8em", boxShadow: "0 0 6px rgba(201,148,26,0.55)" }} />
            )}
            <span className={`block text-[0.28em] tracking-[6px] text-secondary font-body not-italic font-light my-1 transition-opacity duration-500 ${ornamentVisible ? "opacity-[0.65]" : "opacity-0"}`}>
              — ✦ —
            </span>
            <em className={`block font-serif text-[1.18em] italic font-normal text-secondary transition-opacity duration-350 ${emVisible ? "opacity-100" : "opacity-0"}`} style={{ minHeight: "1.22em" }}>
              <span>{line2Text}</span>
              {cursor2Active && !cursor2FadeOut && (
                <span className="inline-block w-[2.5px] bg-secondary rounded-sm ml-[3px] align-middle relative -top-[0.06em] animate-[twBlink_1.05s_step-start_infinite]" style={{ height: "0.8em", boxShadow: "0 0 6px rgba(201,148,26,0.55)" }} />
              )}
              {cursor2FadeOut && (
                <span className="inline-block w-[2.5px] bg-secondary rounded-sm ml-[3px] align-middle relative -top-[0.06em] animate-[twFadeOut_0.8s_ease_forwards]" style={{ height: "0.8em", boxShadow: "0 0 6px rgba(201,148,26,0.55)" }} />
              )}
            </em>
          </h1>
        </div>
      </div>

      {/* Gold divider line */}
      <div className={`h-px mx-auto my-6 bg-gradient-to-r from-transparent via-secondary to-transparent ${lineAnimate ? "animate-[drawLine_1.1s_cubic-bezier(0.4,0,0.2,1)_forwards]" : "w-0 opacity-0"}`} />

      {/* Subtext */}
      <p className={`relative z-[2] font-serif italic font-light text-muted-foreground max-w-[560px] leading-[1.6] transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${subtextVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"}`} style={{ fontSize: "clamp(17px, 2.2vw, 24px)" }}>
        Where tradition meets the digital world — elegantly
      </p>

      {/* Description */}
      <p className={`relative z-[2] text-sm text-muted-foreground max-w-[460px] leading-[1.9] mt-3.5 font-light transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${descVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"}`}>
        Stunning digital wedding invitations with live RSVP tracking, WhatsApp delivery, and real-time guest management — crafted for every Indian wedding tradition.
      </p>

      {/* Actions */}
      <div className={`relative z-[2] flex flex-wrap gap-3.5 justify-center mt-9 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${actionsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"}`}>
        <Link
          to="/templates"
          className="relative overflow-hidden bg-primary text-primary-foreground px-10 py-4 text-[11px] font-semibold tracking-[2px] uppercase hover:bg-[hsl(var(--maroon-dark))] hover:-translate-y-[3px] transition-all duration-300 shadow-[0_8px_32px_rgba(123,28,46,0.28)]"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          Browse Templates — Free
        </Link>
        <button
          onClick={() => document.querySelector("#how")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-transparent text-primary px-9 py-[15px] text-[11px] font-medium tracking-[2px] uppercase border border-primary/35 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          See How It Works
        </button>
      </div>

      {/* Stats */}
      <div className={`relative z-[2] flex gap-0 mt-14 bg-white/55 backdrop-blur-xl border border-secondary/[0.18] rounded-2xl overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[18px]"}`}>
        {[
          { num: "50,000+", label: "Happy Couples" },
          { num: "200+", label: "Templates" },
          { num: "4.9 ★", label: "Average Rating" },
          { num: "₹0", label: "Paper Waste" },
        ].map((s, i) => (
          <div key={s.label} className={`text-center px-6 md:px-10 py-5 relative ${i > 0 ? "before:absolute before:left-0 before:top-[20%] before:bottom-[20%] before:w-px before:bg-secondary/20" : ""}`}>
            <div className="font-display text-[28px] font-bold text-primary tracking-[-0.5px]">{s.num}</div>
            <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground mt-[3px]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className={`absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[9px] tracking-[3px] uppercase z-[2] transition-opacity duration-1000 ${scrollVisible ? "opacity-100" : "opacity-0"}`} style={{ color: "rgba(92,26,26,0.3)" }}>
        <span>Scroll</span>
        <div className="w-5 h-8 border border-secondary/35 rounded-[10px] flex items-start justify-center pt-[5px]">
          <div className="w-1 h-1 rounded-full bg-secondary/60 animate-[scrollDot_2s_ease_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
