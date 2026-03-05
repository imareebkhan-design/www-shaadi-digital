import { Leaf, Globe, RefreshCw, IndianRupee, Smartphone, BarChart3 } from "lucide-react";

const reasons = [
  { icon: IndianRupee, title: "Save ₹5,000–50,000+", desc: "A fraction of the cost of printed cards" },
  { icon: Smartphone, title: "Instant WhatsApp Sharing", desc: "One tap to share with every guest" },
  { icon: RefreshCw, title: "Update Anytime", desc: "Change venue or date? Update live — no reprints" },
  { icon: Globe, title: "NRI Accessible", desc: "Overseas family gets the invite instantly" },
  { icon: BarChart3, title: "Real-Time RSVPs", desc: "Know exactly who's coming, with meal preferences" },
  { icon: Leaf, title: "Eco-Friendly", desc: "Zero paper waste. Green celebrations" },
];

const WhyDigitalSection = () => (
  <section className="section-padding bg-card">
    <div className="container text-center">
      <p className="font-serif italic text-secondary text-base mb-2">The Smarter Choice</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        Why Go Digital?
      </h2>
      <div className="gold-divider mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {reasons.map((r) => (
          <div key={r.title} className="flex flex-col items-center text-center p-6">
            <div className="w-14 h-14 flex items-center justify-center bg-callout rounded-full mb-4">
              <r.icon className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{r.title}</h3>
            <p className="font-body text-sm text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyDigitalSection;
