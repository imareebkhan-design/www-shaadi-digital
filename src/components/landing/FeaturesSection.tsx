import {
  Palette, Globe, MapPin, Users, Smartphone, Calendar,
  Camera, MessageSquare, Shield
} from "lucide-react";

const features = [
  { icon: Palette, title: "Community-Specific Designs", desc: "Templates authentic to North Indian, South Indian, Sikh, and Muslim weddings" },
  { icon: Globe, title: "Multi-Language Support", desc: "English, Hindi, Tamil, Punjabi, and Urdu" },
  { icon: MapPin, title: "Google Maps Integration", desc: "Embedded live maps for every venue" },
  { icon: Users, title: "RSVP Management", desc: "Guest count, meal preferences, and notes — all in one dashboard" },
  { icon: Smartphone, title: "WhatsApp-First Sharing", desc: "One-tap sharing with a pre-written message" },
  { icon: Calendar, title: "Multi-Event Support", desc: "Mehndi, Haldi, Sangeet, Baraat, Ceremony, and Reception" },
  { icon: Camera, title: "Photo Upload", desc: "Add your couple photo — auto-cropped to fit the template" },
  { icon: MessageSquare, title: "Personal Message", desc: "Add a heartfelt note to your guests" },
  { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and never shared" },
];

const FeaturesSection = () => (
  <section className="section-padding bg-background">
    <div className="container text-center">
      <p className="font-serif italic text-secondary text-base mb-2">Everything You Need</p>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
        Powerful Features
      </h2>
      <div className="gold-divider mb-12" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((f) => (
          <div
            key={f.title}
            className="border border-border bg-card p-6 text-left hover:border-secondary hover:shadow-md transition-all duration-300"
          >
            <f.icon className="w-6 h-6 text-secondary mb-4" />
            <h3 className="font-display text-base font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="font-body text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
