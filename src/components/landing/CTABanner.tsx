import { Link } from "react-router-dom";

const CTABanner = () => (
  <section className="relative overflow-hidden text-center py-24 px-10" style={{ background: 'hsl(var(--maroon-dark))' }}>
    {/* Background Hindi text */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[300px] font-bold text-white/[0.03] whitespace-nowrap pointer-events-none select-none">
      शादी
    </div>

    <div className="relative z-10">
      <div className="section-label justify-center !text-secondary/80 before:!bg-secondary/80 after:!bg-secondary/80">Start Today</div>
      <h2 className="font-display font-bold text-white leading-[1.2] mb-5 text-[clamp(30px,5vw,58px)]">
        Apni Shaadi ka<br />
        <em className="italic text-secondary">Perfect Invitation</em><br />
        abhi banao
      </h2>
      <p className="text-base text-white/60 max-w-[480px] mx-auto mb-9 leading-[1.8]">
        Join 50,000+ Indian couples who made their special day even more memorable with Shaadi.Digital.
      </p>
      <Link
        to="/templates"
        className="inline-block bg-secondary text-foreground px-12 py-[18px] text-[13px] font-semibold tracking-[1.2px] uppercase hover:bg-white transition-colors"
      >
        Browse Templates — Free Preview
      </Link>
      <p className="mt-5 text-xs text-white/35 tracking-[0.5px]">
        No credit card required · Preview for free · Pay only when you love it
      </p>
    </div>
  </section>
);

export default CTABanner;
