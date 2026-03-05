const features = [
  { icon: "🎨", title: "Custom Design", desc: "Full personalization — choose colors, fonts, add photos, and make it truly yours. No design skills needed." },
  { icon: "📱", title: "Mobile Optimized", desc: "Your invite looks stunning on every phone — from iPhone 15 to the oldest Android. Perfect for every guest." },
  { icon: "🗓️", title: "Multiple Events", desc: "Mehndi, Haldi, Sangeet, Baraat, Reception — add all events with individual timings, venues & maps." },
  { icon: "📍", title: "Live Google Maps", desc: 'Guests can navigate directly from the invite to your venue. No more "bhai, address kya hai?" messages.' },
  { icon: "📊", title: "RSVP Dashboard", desc: "See attendance counts, dietary preferences, and notes from guests in real time. Plan catering perfectly." },
  { icon: "🔔", title: "Reminder Alerts", desc: "Auto-send reminders to guests who haven't responded. Never chase RSVPs via phone calls again." },
  { icon: "🌐", title: "NRI Friendly", desc: "Indian Standard Time, timezone notes for international guests — perfect for families spread across the globe." },
  { icon: "🔒", title: "Private & Secure", desc: "Password-protect your invite. Only people with your link — or the password — can view it." },
  { icon: "♾️", title: "Free Updates", desc: "Venue changed? Date shifted? Edit and update your invite anytime, and all guests get the new version instantly." },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding bg-card">
    <div className="max-w-[1100px] mx-auto">
      <div className="text-center mb-16">
        <div className="section-label justify-center">Everything Included</div>
        <h2 className="section-title text-center">Sab kuch ek jagah,<br /><em>ek price mein</em></h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-8 border border-secondary/15 rounded transition-all duration-300 relative overflow-hidden group hover:border-secondary/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
          >
            {/* Bottom gold bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-secondary scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            <div className="text-[32px] mb-4">{f.icon}</div>
            <h3 className="font-display text-[19px] mb-2.5" style={{ color: 'hsl(var(--maroon-dark))' }}>{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-[1.8]">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
