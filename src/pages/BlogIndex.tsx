import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowRight } from "lucide-react";

/* ── static data ── */
const CATEGORIES = [
  { key: "all", label: "All Articles" },
  { key: "guide", label: "How-to Guides" },
  { key: "tips", label: "Wedding Tips" },
  { key: "compare", label: "Comparisons" },
  { key: "rsvp", label: "RSVP & Planning" },
  { key: "template", label: "Templates" },
];

interface BlogPost {
  slug: string;
  category: string;
  chipLabel: string;
  chipStyle: "dark" | "gold" | "cream";
  readTime: string;
  eyebrow: string;
  title: React.ReactNode;
  excerpt: string;
  date: string;
  bgClass: string;
  art: React.ReactNode;
}

const FEATURED = {
  slug: "/blog/how-to-send-digital-wedding-invitation-whatsapp",
  category: "guide",
  badge: "Featured Guide",
  title: (
    <>
      How to Send Digital Wedding Invitations on <em className="italic text-secondary not-italic" style={{ fontStyle: "italic", color: "hsl(var(--gold))" }}>WhatsApp</em> in India
    </>
  ),
  excerpt:
    "Create, personalise, and share your eInvite in under 10 minutes. Step-by-step from template selection to live RSVP tracking — no design skills needed.",
  meta: ["6 March 2026", "7 min read", "How-to Guide"],
};

const POSTS: BlogPost[] = [
  {
    slug: "/blog/digital-vs-printed-wedding-invitations",
    category: "compare",
    chipLabel: "Comparison",
    chipStyle: "gold",
    readTime: "6 min",
    eyebrow: "Cost & Value",
    title: (
      <>
        Digital vs Printed:<br />The Complete <em>2026 Breakdown</em>
      </>
    ),
    excerpt:
      "Full cost comparison, delivery times, RSVP tracking, and the hybrid approach most Indian couples choose today.",
    date: "6 March 2026",
    bgClass: "bg-amethyst",
    art: (
      <div className="relative z-[3] text-center p-6">
        <div className="font-subheading text-[11px] italic" style={{ color: "rgba(201,148,26,.55)", letterSpacing: "1.5px" }}>
          Digital &nbsp; vs &nbsp; Printed
        </div>
        <div className="font-subheading text-[20px] text-white/85 leading-tight mt-1">
          ₹999<br /><em className="italic" style={{ color: "hsl(var(--gold-light))" }}>vs ₹48,000</em>
        </div>
        <div className="text-[8px] uppercase tracking-[2px] text-white/30 mt-1.5">Cost for 300 guests</div>
      </div>
    ),
  },
  {
    slug: "/blog/how-to-track-wedding-rsvps-online",
    category: "rsvp",
    chipLabel: "RSVP & Planning",
    chipStyle: "dark",
    readTime: "5 min",
    eyebrow: "Guest Management",
    title: (
      <>
        Track RSVPs Without<br /><em>Chasing Anyone</em>
      </>
    ),
    excerpt:
      "A live dashboard showing real-time attendance — so when the caterer calls, you already have the answer.",
    date: "6 March 2026",
    bgClass: "bg-rose-blog",
    art: null,
  },
  {
    slug: "/blog/best-wedding-invitation-templates-india-2026",
    category: "template",
    chipLabel: "Templates",
    chipStyle: "cream",
    readTime: "8 min",
    eyebrow: "Design Guide",
    title: (
      <>
        Best Templates for Every<br />Indian <em>Tradition in 2026</em>
      </>
    ),
    excerpt:
      "From Royal Maroon to Pearl Nikah — choosing the perfect design for your culture and theme.",
    date: "Coming Soon",
    bgClass: "bg-emerald-blog",
    art: (
      <div className="relative z-[3] text-center p-6">
        <div className="font-subheading text-[11px] italic" style={{ color: "rgba(201,148,26,.55)", letterSpacing: "1.5px" }}>
          Design Collection
        </div>
        <div className="font-subheading text-[26px] text-white/85 leading-tight mt-1">
          20+<br /><em className="italic" style={{ color: "hsl(var(--gold-light))" }}>Templates</em>
        </div>
        <div className="text-[8px] uppercase tracking-[2px] text-white/30 mt-1.5">Every Indian Tradition</div>
      </div>
    ),
  },
  {
    slug: "/blog/digital-wedding-invitations-nri-families",
    category: "tips",
    chipLabel: "Wedding Tips",
    chipStyle: "dark",
    readTime: "6 min",
    eyebrow: "NRI Families",
    title: (
      <>
        Invites for Families<br />Spread Across the <em>Globe</em>
      </>
    ),
    excerpt: "US, UK, UAE guests — timezone detection, instant delivery, no courier delays.",
    date: "Coming Soon",
    bgClass: "bg-royal-blog",
    art: (
      <div className="relative z-[3] text-center p-6">
        <div className="font-subheading text-[11px] italic" style={{ color: "rgba(201,148,26,.55)", letterSpacing: "1.5px" }}>
          NRI Families
        </div>
        <div className="font-subheading text-[20px] text-white/85 leading-tight mt-1">
          Delhi<br /><em className="italic" style={{ color: "hsl(var(--gold-light))" }}>↔ New York</em>
        </div>
      </div>
    ),
  },
  {
    slug: "/blog/how-much-does-digital-wedding-invitation-cost-india",
    category: "compare",
    chipLabel: "Pricing Guide",
    chipStyle: "gold",
    readTime: "4 min",
    eyebrow: "Cost Breakdown",
    title: (
      <>
        How Much Does a Digital<br />Invite Cost in <em>India?</em>
      </>
    ),
    excerpt:
      "Transparent pricing breakdown — what's included and how to get the best value for your wedding.",
    date: "Coming Soon",
    bgClass: "bg-marigold-blog",
    art: (
      <div className="relative z-[3] text-center p-6">
        <div className="font-subheading text-[11px] italic" style={{ color: "rgba(201,148,26,.55)", letterSpacing: "1.5px" }}>
          Starting from
        </div>
        <div className="font-subheading text-[34px] text-white/85 leading-tight mt-1" style={{ fontWeight: 400 }}>
          ₹999
        </div>
        <div className="text-[8px] uppercase tracking-[2px] text-white/30 mt-1.5">One-time · No per-guest fee</div>
      </div>
    ),
  },
];

/* ── helpers ── */
const chipClasses: Record<string, string> = {
  dark: "bg-black/45 backdrop-blur-sm text-white/90 border border-white/10",
  gold: "bg-[rgba(201,148,26,.18)] backdrop-blur-sm border border-[rgba(201,148,26,.3)]",
  cream: "bg-[rgba(250,246,239,.9)] border border-[rgba(201,148,26,.2)]",
};
const chipTextClasses: Record<string, string> = {
  dark: "text-white/90",
  gold: "text-[#E8B84B]",
  cream: "text-primary",
};

/* ── Reveal on scroll ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("blog-on"); }),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`blog-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ── page ── */
const BlogIndex = () => {
  const [filter, setFilter] = useState("all");

  const filteredPosts = POSTS.filter((p) => filter === "all" || p.category === filter);
  const showFeatured = filter === "all" || FEATURED.category === filter;
  const count = filteredPosts.length + (showFeatured ? 1 : 0);

  return (
    <>
      <SEOHead
        title="Wedding Blog — Tips, Ideas & Guides | Shaadi.Digital"
        description="Wedding planning tips, digital invitation guides, RSVP advice and template inspiration from Shaadi.Digital. Trusted by 50,000+ Indian couples."
        canonical="https://shaadi.digital/blog"
      />
      <Navbar />

      {/* HERO */}
      <section className="blog-hero">
        {/* Mandala */}
        <svg className="blog-hero-mandala" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="192" stroke="#C9941A" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="158" stroke="#C9941A" strokeWidth="0.4" />
          <circle cx="200" cy="200" r="124" stroke="#C9941A" strokeWidth="0.35" />
          <circle cx="200" cy="200" r="90" stroke="#C9941A" strokeWidth="0.3" />
          <path d="M200 8L206 194L392 200L206 206L200 392L194 206L8 200L194 194Z" stroke="#C9941A" strokeWidth="0.45" fill="none" />
          <path d="M200 52L204 196L348 200L204 204L200 348L196 204L52 200L196 196Z" stroke="#C9941A" strokeWidth="0.3" fill="none" />
          <circle cx="200" cy="200" r="5" fill="rgba(201,148,26,0.22)" />
        </svg>

        {/* Bokeh particles */}
        {[
          { w: 7, top: "22%", left: "12%", op: 0.35, dur: 10, del: 0 },
          { w: 4, top: "55%", left: "8%", op: 0.25, dur: 13, del: 2 },
          { w: 6, top: "32%", left: "89%", op: 0.3, dur: 9, del: 4 },
          { w: 3, top: "70%", left: "79%", op: 0.28, dur: 11, del: 1 },
          { w: 5, top: "82%", left: "28%", op: 0.2, dur: 14, del: 6 },
        ].map((b, i) => (
          <div
            key={i}
            className="blog-bokeh"
            style={{
              width: b.w,
              height: b.w,
              top: b.top,
              left: b.left,
              ["--op" as string]: b.op,
              ["--dur" as string]: `${b.dur}s`,
              ["--del" as string]: `${b.del}s`,
              background: `radial-gradient(circle,rgba(201,148,26,${b.op > 0.3 ? 0.6 : 0.5}),transparent 70%)`,
            }}
          />
        ))}

        <div className="relative z-[2] max-w-[760px] mx-auto text-center">
          <div className="inline-flex items-center gap-3.5 text-[9px] tracking-[4px] uppercase mb-9" style={{ color: "rgba(201,148,26,.5)" }}>
            <span className="block w-9 h-px" style={{ background: "rgba(201,148,26,.35)" }} />
            Wedding Journal 2026
            <span className="block w-9 h-px" style={{ background: "rgba(201,148,26,.35)" }} />
          </div>
          <h1 className="font-display text-white/95 font-bold leading-[1.1] tracking-tight" style={{ fontSize: "clamp(48px,7vw,88px)" }}>
            Stories, Ideas &amp;<br /><em className="block italic" style={{ color: "hsl(var(--gold-light))" }}>Inspiration</em>
          </h1>
          <p className="font-subheading italic font-light text-white/40 leading-relaxed max-w-[500px] mx-auto mt-6" style={{ fontSize: "clamp(16px,2vw,22px)" }}>
            Everything you need to plan a beautiful Indian wedding — from digital invitations to managing 500 guests on WhatsApp
          </p>
          {/* rule */}
          <div className="blog-hero-rule mx-auto my-11" />
          {/* stats pill */}
          <div className="inline-flex bg-white/5 border border-[rgba(201,148,26,.18)] rounded-full overflow-hidden backdrop-blur-md blog-stats-pill">
            {[
              { num: "50K+", lbl: "Couples Helped" },
              { num: "12K+", lbl: "Monthly Readers" },
              { num: "15+", lbl: "Expert Guides" },
            ].map((s, i) => (
              <div key={i} className="blog-hero-stat relative px-10 py-3.5 text-center">
                {i > 0 && <span className="absolute left-0 top-1/4 bottom-1/4 w-px" style={{ background: "rgba(201,148,26,.18)" }} />}
                <div className="font-display text-[22px] font-bold leading-none" style={{ color: "hsl(var(--gold-light))" }}>{s.num}</div>
                <div className="text-[8px] tracking-[2px] uppercase text-white/30 mt-1">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[8px] tracking-[3px] uppercase text-white/20 z-[2] blog-fade-in">
          <div className="w-[18px] h-[28px] border border-[rgba(201,148,26,.22)] rounded-[9px] flex items-start justify-center pt-[5px]">
            <div className="w-[3px] h-[3px] rounded-full bg-[rgba(201,148,26,.5)] blog-scroll-dot" />
          </div>
          Scroll
        </div>
      </section>

      {/* FILTER BAR */}
      <div className="sticky top-[68px] z-[90] bg-background border-b border-secondary/10 flex items-center justify-between px-6 md:px-[72px]">
        <div className="flex overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`py-4 px-5 text-[10px] font-medium tracking-[1.5px] uppercase whitespace-nowrap border-b-2 -mb-px transition-all font-body ${
                filter === c.key
                  ? "text-primary border-secondary"
                  : "text-muted-foreground border-transparent hover:text-primary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="text-[10px] text-muted-foreground hidden md:block">
          <b className="text-secondary font-semibold">{count}</b> articles
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-[72px] py-20 md:py-[80px_72px_120px]">
        {/* Featured heading */}
        {showFeatured && (
          <>
            <Reveal>
              <div className="flex items-end justify-between mb-10 pb-4 border-b border-secondary/10">
                <div>
                  <div className="text-[9px] tracking-[3.5px] uppercase text-secondary mb-1.5">Featured</div>
                  <div className="font-display text-[26px] font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
                    Editor's <em className="italic" style={{ color: "hsl(var(--gold))" }}>Pick</em>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* FEATURED CARD */}
            <Reveal>
              <Link to={FEATURED.slug} className="blog-featured group block mb-[72px]">
                {/* Visual side */}
                <div className="blog-feat-visual">
                  {/* Bokeh circles */}
                  <div className="absolute rounded-full pointer-events-none" style={{ width: 200, height: 200, top: "12%", left: "18%", background: "radial-gradient(circle,rgba(201,148,26,.25),transparent 70%)" }} />
                  <div className="absolute rounded-full pointer-events-none" style={{ width: 110, height: 110, top: "52%", left: "58%", background: "radial-gradient(circle,rgba(201,148,26,.15),transparent 70%)" }} />
                  <div className="absolute rounded-full pointer-events-none" style={{ width: 150, height: 150, top: "28%", left: "52%", background: "radial-gradient(circle,rgba(201,148,26,.18),transparent 70%)" }} />
                  {/* Rings SVG */}
                  <svg className="absolute inset-0 w-full h-full opacity-[.07]" viewBox="0 0 500 480" fill="none">
                    <circle cx="250" cy="240" r="220" stroke="#C9941A" strokeWidth="0.6" />
                    <circle cx="250" cy="240" r="175" stroke="#C9941A" strokeWidth="0.45" />
                    <circle cx="250" cy="240" r="130" stroke="#C9941A" strokeWidth="0.35" />
                    <path d="M250 20L255 235L470 240L255 245L250 460L245 245L30 240L245 235Z" stroke="#C9941A" strokeWidth="0.5" fill="none" />
                  </svg>
                  {/* Invite artwork */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] text-center w-[260px]">
                    <div className="text-[8px] tracking-[3px] uppercase" style={{ color: "rgba(201,148,26,.6)" }}>Digital Invitation</div>
                    <div className="font-subheading text-[40px] font-normal text-white/90 leading-[1.1] mt-3.5">
                      Priya<br /><em className="italic block" style={{ color: "hsl(var(--gold-light))" }}>&amp; Rohan</em>
                    </div>
                    <div className="w-[50px] h-px mx-auto my-4" style={{ background: "linear-gradient(to right,transparent,rgba(201,148,26,.6),transparent)" }} />
                    <div className="text-[9px] tracking-[3px] uppercase text-white/30">20 · 11 · 2026 · Mumbai</div>
                    <div className="mt-4 inline-block px-5 py-[7px] rounded-full border border-[rgba(201,148,26,.35)] bg-[rgba(201,148,26,.08)] text-[7px] tracking-[2.5px] uppercase" style={{ color: "rgba(201,148,26,.8)" }}>
                      Tap to RSVP ✓
                    </div>
                  </div>
                  {/* Right gradient */}
                  <div className="absolute top-0 right-0 bottom-0 w-20 z-[5]" style={{ background: "linear-gradient(to right,transparent,rgba(250,246,239,1))" }} />
                </div>
                {/* Body side */}
                <div className="bg-card p-10 md:p-14 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-[8px] font-semibold tracking-[2.5px] uppercase text-secondary mb-5">
                    <span className="block w-7 h-px bg-secondary" />
                    {FEATURED.badge}
                  </div>
                  <h2 className="font-display font-bold leading-[1.28] mb-4" style={{ fontSize: "clamp(22px,2.5vw,32px)", color: "hsl(var(--maroon-dark))" }}>
                    {FEATURED.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-light leading-[1.9] mb-7">{FEATURED.excerpt}</p>
                  <div className="flex gap-3.5 text-[10px] text-muted-foreground items-center mb-8">
                    {FEATURED.meta.map((m, i) => (
                      <span key={i} className="flex items-center gap-3.5">
                        {i > 0 && <span className="w-[2px] h-[2px] rounded-full bg-muted-foreground/40" />}
                        {m}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-3.5 text-[10px] font-semibold tracking-[2px] uppercase text-primary group-hover:text-secondary group-hover:gap-[18px] transition-all">
                    Read Article
                    <span className="w-[38px] h-[38px] rounded-full border-[1.5px] border-primary/25 flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all">
                      <ArrowRight className="w-[13px] h-[13px] group-hover:text-white" />
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </>
        )}

        {/* Latest heading */}
        <Reveal>
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-secondary/10 mt-[72px]">
            <div>
              <div className="text-[9px] tracking-[3.5px] uppercase text-secondary mb-1.5">Latest</div>
              <div className="font-display text-[26px] font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
                From the <em className="italic" style={{ color: "hsl(var(--gold))" }}>Wedding Journal</em>
              </div>
            </div>
            <Link to="/blog" className="text-[10px] tracking-[2px] uppercase text-muted-foreground hover:text-secondary transition-colors flex items-center gap-1.5">
              All Articles <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-7">
          {filteredPosts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-[72px]">
          {filteredPosts.slice(3, 5).map((post, i) => (
            <Reveal key={post.slug} delay={i * 80}>
              <BlogCard post={post} />
            </Reveal>
          ))}
          {/* Coming soon card */}
          {(filter === "all" || filter === "tips") && (
            <Reveal delay={160}>
              <Link
                to="/blog"
                className="border-[1.5px] border-dashed border-secondary/20 rounded-md flex flex-col items-center justify-center text-center p-11 hover:border-secondary hover:bg-secondary/[.025] transition-all min-h-[290px]"
              >
                <div className="text-[30px] mb-3.5 opacity-45">✍️</div>
                <h4 className="font-display text-[15px] font-bold leading-[1.35] mb-2" style={{ color: "hsl(var(--maroon-dark))" }}>
                  Wedding Invitation Wording for <em className="italic" style={{ color: "hsl(var(--gold))" }}>Every Tradition</em>
                </h4>
                <p className="text-[11.5px] text-muted-foreground font-light leading-[1.65]">
                  Hindu, Muslim, Sikh, South Indian — beautifully worded examples in English and Hindi
                </p>
                <div className="mt-4 inline-block px-3.5 py-1 rounded-full bg-secondary/[.07] border border-secondary/20 text-[8px] tracking-[2px] uppercase text-secondary">
                  Coming Soon
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </div>

      {/* NEWSLETTER */}
      <section className="blog-newsletter">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 55% at 50% -15%,rgba(201,148,26,.16) 0%,transparent 60%)" }} />
        <div className="max-w-[540px] mx-auto relative z-[2] text-center">
          <div className="text-[9px] tracking-[4px] uppercase mb-4" style={{ color: "rgba(201,148,26,.55)" }}>
            Wedding Journal
          </div>
          <h3 className="font-display font-bold leading-[1.2] mb-3" style={{ fontSize: "clamp(28px,4vw,44px)", color: "hsl(var(--ivory))" }}>
            Ideas &amp; tips,<br />every <em className="italic" style={{ color: "hsl(var(--gold-light))" }}>month in your inbox</em>
          </h3>
          <p className="text-sm text-white/45 font-light leading-[1.7] mb-9">
            Join 12,000+ couples getting new template launches, planning guides, and wedding inspiration from the Shaadi.Digital team.
          </p>
          <div className="flex max-w-[420px] mx-auto rounded-[3px] overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,.35)]">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 border-none bg-background text-[13px] font-body outline-none text-foreground placeholder:text-muted-foreground/40"
            />
            <button className="bg-secondary text-[10px] font-bold tracking-[2px] uppercase px-6 py-4 border-none whitespace-nowrap font-body hover:brightness-110 transition-all" style={{ color: "hsl(var(--maroon-dark))" }}>
              Subscribe
            </button>
          </div>
          <div className="text-[10px] text-white/20 mt-3.5">No spam · Unsubscribe anytime</div>
        </div>
      </section>

      <Footer />
    </>
  );
};

/* ── Card component ── */
const BlogCard = ({ post }: { post: BlogPost }) => (
  <Link
    to={post.slug}
    className="blog-card group bg-card rounded-md overflow-hidden flex flex-col border border-secondary/10 shadow-[0_2px_16px_rgba(74,14,26,.05)] hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(74,14,26,.13)] hover:border-secondary/20 transition-all duration-500 relative"
  >
    {/* Bottom accent bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
    {/* Image area */}
    <div className="h-[200px] relative overflow-hidden flex items-center justify-center">
      <div className={`absolute inset-0 ${post.bgClass}`} />
      <div className="absolute inset-0 z-[2]" style={{ background: "linear-gradient(to top,rgba(26,5,8,.65),transparent 55%)" }} />
      {post.art}
      {/* Chip */}
      <div className={`absolute top-4 left-4 z-[5] px-3 py-1 rounded-full text-[8px] font-semibold tracking-[2px] uppercase ${chipClasses[post.chipStyle]} ${chipTextClasses[post.chipStyle]}`}>
        {post.chipLabel}
      </div>
      <div className="absolute bottom-3.5 right-3.5 z-[5] text-[8px] tracking-[1px] text-white/55">
        {post.readTime}
      </div>
    </div>
    {/* Body */}
    <div className="p-[26px_26px_30px] flex-1 flex flex-col">
      <div className="text-[8px] tracking-[3px] uppercase text-secondary mb-2.5">{post.eyebrow}</div>
      <h3 className="font-display text-[17px] font-bold leading-[1.35] mb-2.5" style={{ color: "hsl(var(--maroon-dark))" }}>
        {post.title}
      </h3>
      <p className="text-[12.5px] text-muted-foreground font-light leading-[1.8] flex-1 mb-5">{post.excerpt}</p>
      <div className="flex items-center justify-between pt-4 border-t border-secondary/10 mt-auto">
        <span className="text-[10px] text-muted-foreground">{post.date}</span>
        <span className="text-[9px] font-semibold tracking-[2px] uppercase text-primary flex items-center gap-1.5 group-hover:gap-2.5 group-hover:text-secondary transition-all">
          Read <ArrowRight className="w-[11px] h-[11px]" />
        </span>
      </div>
    </div>
  </Link>
);

export default BlogIndex;
