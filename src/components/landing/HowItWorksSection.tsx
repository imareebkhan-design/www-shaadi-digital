import { Search, PenTool, CreditCard, Share2 } from "lucide-react";

const steps = [
  { icon: Search, step: "01", title: "Browse Templates", desc: "Explore designs for every Indian community and style" },
  { icon: PenTool, step: "02", title: "Personalise", desc: "Add names, dates, events, photo — guided wizard, no design skills needed" },
  { icon: CreditCard, step: "03", title: "Pay & Publish", desc: "Choose a plan and go live instantly with your unique link" },
  { icon: Share2, step: "04", title: "Share & Track", desc: "Send via WhatsApp and watch RSVPs roll in on your dashboard" },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding bg-background mandala-bg">
    <div className="container text-center">
      <p className="font-serif italic text-secondary text-base mb-2">Simple & Elegant</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        How It Works
      </h2>
      <div className="gold-divider mb-14" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((s) => (
          <div key={s.step} className="relative flex flex-col items-center text-center group">
            <span className="font-display text-5xl font-bold text-secondary/20 absolute -top-4 left-1/2 -translate-x-1/2">
              {s.step}
            </span>
            <div className="w-16 h-16 flex items-center justify-center border border-secondary bg-card rounded-full mb-5 mt-6 group-hover:bg-primary group-hover:border-primary transition-colors">
              <s.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
            <p className="font-body text-sm text-muted-foreground max-w-xs">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
