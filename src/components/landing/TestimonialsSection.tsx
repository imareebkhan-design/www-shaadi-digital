const testimonials = [
  {
    text: 'Hamare relatives Delhi, Mumbai aur New Jersey mein hain. Sab ne invite ek minute mein open kiya — <em>kisi ne ek baar bhi \'link kaam nahi kar raha\' nahi kaha.</em> RSVP dashboard ne catering planning ekdum smooth kar di.',
    name: "Ritu & Sameer Sharma",
    location: "Delhi NCR · Royal Maroon template · Nov 2024",
    initials: "RS",
    gradient: "linear-gradient(135deg,#5C1A1A,#8C2A2A)",
    platform: "Google",
    featured: false,
  },
  {
    text: 'Meri saheliyaan poochh rahi thi — <em>\'yaar, ye invite kisne design kiya?\'</em> Sach mein, mujhe ek bhi design decision nahi lena pada. Template choose ki, naam daala, music upload ki — bas ho gaya. Shaadi ke baad bhi sab log link save karke rakhte hain.',
    name: "Priyanka & Nikhil Nair",
    location: "Kochi · Emerald South template · Dec 2024",
    initials: "PN",
    gradient: "linear-gradient(135deg,#1A3A5C,#2A5C8C)",
    platform: "Instagram",
    featured: true,
  },
  {
    text: 'Shaadi se 4 din pehle venue change hua. <em>2 minutes mein update kar diya</em> — 340 guests ke phones pe automatically naya address pahunch gaya. Agar printed cards hote toh sochna bhi nahi chahta tha.',
    name: "Arjun & Kavitha Menon",
    location: "Bangalore · Golden Sehra template · Jan 2025",
    initials: "AK",
    gradient: "linear-gradient(135deg,#1A4A2A,#2A7A3A)",
    platform: "Google",
    featured: false,
  },
  {
    text: 'Meri family ke 12 WhatsApp groups hain — sab mein ek link share kiya. <em>Kisi ne ek bhi baar \'address bhej do\' nahi likha.</em> Pehli baar shaadi planning mein koi cheez simple lagi.',
    name: "Harpreet & Kulwinder Singh",
    location: "Amritsar · Golden Sehra template · Oct 2024",
    initials: "HK",
    gradient: "linear-gradient(135deg,#4A2A1A,#8C5A2A)",
    platform: "Google",
    featured: false,
  },
  {
    text: 'Hum chahte the ki invite mein <em>Nikah, Walima aur Mehndi teeno alag alag dikhein</em> — aur exactly waisa hua. Har event ka alag time aur Google Maps link. Bahut professional laga.',
    name: "Aisha & Zayan Qureshi",
    location: "Hyderabad · Pearl Nikah template · Feb 2025",
    initials: "AZ",
    gradient: "linear-gradient(135deg,#2A2A3A,#4A4A5C)",
    platform: "WhatsApp review",
    featured: false,
  },
  {
    text: 'Chennai mein typically printed invites ka itna tradition hai — but <em>mere in-laws bhi impressed ho gaye.</em> Emerald South template bilkul hum jaisa laga. Support team ne ek ghante mein reply kiya jab ek doubt tha.',
    name: "Kavya & Siddharth Iyer",
    location: "Chennai · Emerald South template · Mar 2025",
    initials: "KS",
    gradient: "linear-gradient(135deg,#1A3A2A,#2A5C3A)",
    platform: "Google",
    featured: false,
  },
];

const TestimonialsSection = () => (
  <section className="section-padding relative overflow-hidden" style={{ background: "hsl(var(--maroon-dark))" }}>
    {/* Dot grid */}
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "radial-gradient(circle, rgba(201,148,26,0.08) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
      maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
    }} />
    <div className="absolute inset-0 pointer-events-none" style={{
      background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,148,26,0.06) 0%, transparent 60%)",
    }} />

    <div className="relative z-[1] max-w-[1160px] mx-auto">
      <div className="text-center mb-16">
        <div className="section-label justify-center !text-[hsl(var(--gold-light))] before:!bg-[hsl(var(--gold-light))] after:!bg-[hsl(var(--gold-light))]">Love Stories</div>
        <h2 className="section-title text-center !text-white">50,000+ couples ne<br /><em className="!text-secondary">humein choose kiya</em></h2>
        <div className="flex items-center justify-center gap-3 md:gap-5 mt-6 flex-wrap">
          <div className="flex gap-[3px]">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-secondary text-base">★</span>)}</div>
          <span className="text-[12px] md:text-[13px] text-white/45 font-light"><strong className="text-white/75 font-medium">4.9 / 5</strong> average rating</span>
          <div className="w-[3px] h-[3px] rounded-full bg-secondary/40 hidden md:block" />
          <span className="text-[12px] md:text-[13px] text-white/45 font-light"><strong className="text-white/75 font-medium">50,000+</strong> weddings</span>
          <div className="w-[3px] h-[3px] rounded-full bg-secondary/40 hidden md:block" />
          <span className="text-[12px] md:text-[13px] text-white/45 font-light"><strong className="text-white/75 font-medium">India's #1</strong> digital invite platform</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {testimonials.map((t) => (
          <div key={t.name} className={`rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 relative ${t.featured ? "bg-secondary/[0.08] border border-secondary/25 hover:border-secondary/50" : "bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] hover:border-secondary/30"}`}>
            <div className="inline-flex items-center gap-[5px] text-[10px] tracking-[0.8px] uppercase text-secondary/70 mb-3.5">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Verified purchase
            </div>
            <div className="flex gap-[2px] mb-3.5">{Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-secondary text-[13px]">★</span>)}</div>
            <span className="font-serif text-[56px] leading-[0.6] text-secondary/20 block mb-2">"</span>
            <p className="font-serif text-[17px] italic leading-[1.75] text-white/80 mb-[22px] [&>em]:not-italic [&>em]:text-secondary/85" dangerouslySetInnerHTML={{ __html: t.text }} />
            <div className="h-px bg-gradient-to-r from-secondary/20 to-transparent mb-[18px]" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-[15px] font-medium text-white shrink-0 border border-white/10" style={{ background: t.gradient }}>{t.initials}</div>
              <div className="flex-1">
                <div className="text-[13px] font-medium text-white/85">{t.name}</div>
                <div className="text-[11px] text-white/35 mt-0.5">{t.location}</div>
              </div>
              <div className="text-[10px] text-white/25 tracking-[0.5px] ml-auto">{t.platform}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
