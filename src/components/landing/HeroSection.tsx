import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

type Particle = {
  w: number;
  top: string;
  dur: string;
  del: string;
  op: number;
} & ({ left: string } | { right: string });

const MandalaLarge = () => (
  <svg className="absolute pointer-events-none w-[700px] h-[700px] -top-[200px] -right-[180px] opacity-[0.055] hidden md:block" style={{ animation: "spin 80s linear infinite" }} viewBox="0 0 500 500" fill="none">
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
  <svg className="absolute pointer-events-none w-[480px] h-[480px] -bottom-[130px] -left-[120px] opacity-[0.04] hidden md:block" style={{ animation: "spin 100s linear infinite reverse" }} viewBox="0 0 400 400" fill="none">
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

const particles: Particle[] = [
  { w: 6, top: "18%", left: "12%", dur: "14s", del: "0s", op: 0.35 },
  { w: 4, top: "35%", left: "22%", dur: "18s", del: "3s", op: 0.2 },
  { w: 8, top: "60%", right: "15%", dur: "12s", del: "1s", op: 0.25 },
  { w: 5, top: "45%", right: "28%", dur: "16s", del: "5s", op: 0.15 },
  { w: 3, top: "25%", right: "35%", dur: "20s", del: "7s", op: 0.3 },
  { w: 7, top: "75%", left: "30%", dur: "15s", del: "2s", op: 0.2 },
  { w: 4, top: "12%", left: "55%", dur: "22s", del: "4s", op: 0.18 },
  { w: 5, top: "80%", right: "45%", dur: "17s", del: "6s", op: 0.22 },
];

const LINE1 = "The Invitation They'll";
const LINE2 = "Remember Forever.";
const BASE_SPEED = 72;
const JITTER = 18;
const SPACE_PAUSE = 120;

// Soft typewriter click using Web Audio API
const createTypingSound = () => {
  let audioCtx: AudioContext | null = null;
  return () => {
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      // Soft mechanical click
      osc.frequency.setValueAtTime(1800 + Math.random() * 600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.025);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (error) {
      // Silently handle audio context errors
      console.warn("Audio playback failed:", error);
    }
  };
};

const HeroSection = () => {
  const [line1Text, setLine1Text] = useState("");
  const [line2Text, setLine2Text] = useState("");
  const [cursor1Active, setCursor1Active] = useState(false);
  const [cursor2Active, setCursor2Active] = useState(false);
  const [cursor2FadeOut, setCursor2FadeOut] = useState(false);
  const [phase, setPhase] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clickRef = useRef(createTypingSound());

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
  }, []);

  const addTimer = useCallback((fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const typeChar = (text: string, setter: React.Dispatch<React.SetStateAction<string>>, onDone: () => void) => {
      let ci = 0;
      const tick = () => {
        ci++;
        setter(text.slice(0, ci));
        if (text[ci - 1] !== " ") clickRef.current();
        if (ci >= text.length) {
          addTimer(onDone, 350);
          return;
        }
        const ch = text[ci] || "";
        const delay = BASE_SPEED + (Math.random() * JITTER * 2 - JITTER) + (ch === " " ? SPACE_PAUSE : 0);
        addTimer(tick, Math.max(45, delay));
      };
      addTimer(tick, 0);
    };

    addTimer(() => {
      setPhase(1);
      setCursor1Active(true);
      typeChar(LINE1, setLine1Text, () => {
        setCursor1Active(false);
        addTimer(() => {
          setPhase(2);
          setCursor2Active(true);
          typeChar(LINE2, setLine2Text, () => {
            setPhase(3);
            addTimer(() => {
              setCursor2Active(false);
              setCursor2FadeOut(true);
            }, 900);
          });
        }, 180);
      });
    }, 700);

    return clearTimers;
  }, [addTimer, clearTimers]);

  const afterHeadline = phase >= 3;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-5 pt-[100px] md:pt-[120px] pb-12 md:pb-20" style={{ background: "#F5EFE4" }}>
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

      {/* Particles - hidden on mobile for perf */}
      <div className="hidden md:block">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.w, height: p.w,
              top: p.top,
              ...( 'left' in p ? { left: p.left } : { right: p.right }),
              background: `radial-gradient(circle, rgba(201,148,26,0.5) 0%, transparent 70%)`,
              animation: `floatP ${p.dur} ease-in-out infinite`,
              animationDelay: p.del,
              opacity: p.op,
            }}
          />
        ))}
      </div>

      {/* Eyebrow */}
      <div className={`relative z-[2] inline-flex items-center gap-2 md:gap-2.5 bg-[rgba(201,148,26,0.08)] border border-secondary/30 backdrop-blur-sm px-4 md:px-5 py-[7px] rounded-full text-[9px] md:text-[10px] font-medium tracking-[1.5px] md:tracking-[2px] uppercase text-secondary mb-6 md:mb-9 opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.22,1,0.36,1)_0.2s_forwards]`}>
        <span className="w-[5px] h-[5px] rounded-full bg-secondary animate-pulse" />
        India's Most Loved Digital Wedding Invitations
        <span className="w-[5px] h-[5px] rounded-full bg-secondary animate-pulse" />
      </div>

      {/* Typewriter Headline */}
      <div className="relative z-[2] flex flex-col items-center justify-center text-center min-h-[120px] md:min-h-[200px]">
        <h1 className="font-display font-bold leading-[1.15]" style={{ fontSize: "clamp(32px, 8vw, 78px)", color: "hsl(var(--maroon-dark))" }}>
          <span>{line1Text}</span>
          {cursor1Active && (
            <span className="inline-block w-[2.5px] bg-secondary rounded-sm ml-[3px] align-middle relative -top-[0.06em] animate-[twBlink_1.05s_step-start_infinite]" style={{ height: "0.8em", boxShadow: "0 0 6px rgba(201,148,26,0.55)" }} />
          )}
          {phase >= 2 && <br />}
          {phase >= 2 && (
            <span>
              <span>{line2Text.replace("Forever.", "")}</span>
              {line2Text.includes("Forever.") && (
                <em
                  className="inline-block italic font-serif text-secondary origin-bottom-left animate-[foreverReveal_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                  style={{ verticalAlign: "baseline" }}
                >
                  Forever.
                </em>
              )}
            </span>
          )}
          {cursor2Active && !cursor2FadeOut && (
            <span className="inline-block w-[2.5px] bg-secondary rounded-sm ml-[3px] align-middle relative -top-[0.06em] animate-[twBlink_1.05s_step-start_infinite]" style={{ height: "0.8em", boxShadow: "0 0 6px rgba(201,148,26,0.55)" }} />
          )}
          {cursor2FadeOut && (
            <span className="inline-block w-[2.5px] bg-secondary rounded-sm ml-[3px] align-middle relative -top-[0.06em] animate-[twFadeOut_0.8s_ease_forwards]" style={{ height: "0.8em", boxShadow: "0 0 6px rgba(201,148,26,0.55)" }} />
          )}
        </h1>
      </div>

      {/* Gold divider */}
      <div className={`h-px mx-auto my-5 md:my-7 bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-700 ${afterHeadline ? "w-24 md:w-32 opacity-100" : "w-0 opacity-0"}`} />

      {/* Subheadline - visible early via CSS animation to avoid LCP render delay */}
      <p className="relative z-[2] text-[15px] md:text-[17px] text-muted-foreground max-w-[540px] leading-[1.8] px-2 font-light opacity-0 animate-[fadeUp_0.8s_cubic-bezier(0.22,1,0.36,1)_1.2s_forwards]">
        Stunning, personalised digital wedding invitations — delivered instantly on WhatsApp, built for every Indian ceremony, from Mehndi to Reception.
      </p>

      {/* CTAs */}
      <div className={`relative z-[2] flex flex-col md:flex-row gap-3.5 w-full md:w-auto items-center justify-center mt-8 md:mt-9 px-4 md:px-0 transition-all duration-700 animation-delay-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${afterHeadline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <Link
          to="/signup"
          className="relative overflow-hidden w-full md:w-auto bg-primary text-primary-foreground px-10 py-4 min-h-[52px] flex items-center justify-center text-[11px] font-semibold tracking-[2px] uppercase rounded-full hover:bg-[hsl(var(--maroon-dark))] hover:-translate-y-[3px] transition-all duration-300 shadow-[0_8px_32px_rgba(123,28,46,0.28)]"
        >
          <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          Start for Free — No Card Needed
        </Link>
        <Link
          to="/templates"
          className="w-full md:w-auto bg-transparent text-primary px-9 py-[15px] min-h-[52px] flex items-center justify-center text-[11px] font-medium tracking-[2px] uppercase rounded-full border border-primary/35 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 transition-all duration-300"
        >
          See How It Works →
        </Link>
      </div>

      {/* Micro trust copy */}
      <p className={`relative z-[2] text-[11px] md:text-xs text-muted-foreground tracking-[0.5px] mt-5 transition-all duration-700 animation-delay-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${afterHeadline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        ✓ 200+ templates &nbsp;·&nbsp; ✓ Live RSVP tracking &nbsp;·&nbsp; ✓ Edit anytime, free
      </p>

      {/* Trust badges */}
      <div className={`relative z-[2] grid grid-cols-2 md:flex mt-8 md:mt-12 bg-white/55 backdrop-blur-xl border border-secondary/[0.18] rounded-2xl overflow-hidden transition-all duration-700 animation-delay-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${afterHeadline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {[
          { icon: "🛡️", label: "100% Secure" },
          { icon: "⏱️", label: "Ready in 10 Minutes" },
          { icon: "💰", label: "Pay Only When You Love It" },
          { icon: "♾️", label: "Updates Free Forever" },
        ].map((s, i) => (
          <div key={s.label} className={`text-center px-4 md:px-8 py-4 md:py-5 relative ${i > 0 ? "md:before:absolute md:before:left-0 md:before:top-[20%] md:before:bottom-[20%] md:before:w-px md:before:bg-secondary/20" : ""} ${i >= 2 ? "border-t md:border-t-0 border-secondary/10" : ""} ${i % 2 === 1 ? "border-l md:border-l-0 border-secondary/10" : ""}`}>
            <span className="text-base md:text-lg">{s.icon}</span>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[1.5px] text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint - hidden on mobile */}
      <div className={`absolute bottom-9 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-[9px] tracking-[3px] uppercase z-[2] transition-opacity duration-1000 animation-delay-[1500ms] ${afterHeadline ? "opacity-100" : "opacity-0"}`} style={{ color: "rgba(92,26,26,0.3)" }}>
        <span>Scroll</span>
        <div className="w-5 h-8 border border-secondary/35 rounded-[10px] flex items-start justify-center pt-[5px]">
          <div className="w-1 h-1 rounded-full bg-secondary/60 animate-[scrollDot_2s_ease_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
