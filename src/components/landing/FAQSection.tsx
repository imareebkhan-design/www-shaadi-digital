import { useState } from "react";

const faqs = [
  { q: "Kya mujhe design knowledge chahiye?", a: "Bilkul nahi! Hamari platform aise design ki gayi hai ki koi bhi — bina kisi technical knowledge ke — 10 minute mein apna invite ready kar sake. Bas apni details bharo, photos upload karo, aur done." },
  { q: "Invite share karne ka best way kya hai?", a: "WhatsApp! Ek link generate hota hai jo aap seedha apne family groups mein share kar sakte ho. Guests ko koi app download nahi karna, koi login nahi — bas link kholo aur invite dekho. Works on every phone." },
  { q: "Kya main baad mein details update kar sakta/sakti hoon?", a: "Haan, bilkul! Kabhi bhi venue, timing, ya koi bhi detail update kar sakte ho — free mein. Jo guests ko link already mil chuka hai, unhe automatically updated version dikhega." },
  { q: "Kya NRI guests ke liye koi problem hogi?", a: "Nahi. Hamare invitations globally accessible hain. Aap IST ke saath different timezone notes bhi add kar sakte ho taaki US, UK, ya Australia mein baithe relatives confuse na hon." },
  { q: "Payment methods kya hain?", a: "UPI, Net Banking, Credit/Debit Card, aur Razorpay ke through payment kar sakte hain. 100% secure checkout. Order confirm hone ke baad turant access milta hai." },
  { q: "Kya ek invitation mein multiple events add ho sakte hain?", a: "Premium plan mein unlimited events add kar sakte ho — Mehndi, Haldi, Sangeet, Baraat, Reception, Griha Pravesh — sab! Har event ka alag time, venue aur Google Maps link hoga." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="section-padding bg-card">
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-12">
          <div className="section-label justify-center">Got Questions?</div>
          <h2 className="section-title text-center">Aksar Pooche Jaate<br /><em>Sawaal</em></h2>
        </div>

        <div>
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-secondary/15">
              <button
                onClick={() => toggle(i)}
                className="w-full flex justify-between items-center py-5 text-left"
              >
                <span className="font-display text-[17px] pr-4" style={{ color: 'hsl(var(--maroon-dark))' }}>
                  {f.q}
                </span>
                <span className={`text-secondary text-xl shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-400 ${
                  openIndex === i ? "max-h-[200px] pb-5" : "max-h-0"
                }`}
              >
                <p className="text-sm text-muted-foreground leading-[1.8]">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
