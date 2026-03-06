import { useState } from "react";
import { Helmet } from "react-helmet-async";

const faqs = [
  { q: "Kya mujhe koi design ya technical knowledge chahiye?", a: '<strong>Bilkul nahi.</strong> Platform itni simple hai ki koi bhi — dadi ho ya teenager — bina kisi help ke 10 minute mein poora invite ready kar sakta hai. Template choose karo, naam aur details bharo, photos upload karo — bas itna. Koi coding nahi, koi design software nahi.' },
  { q: "Invite share karne ka sabse acha tarika kya hai?", a: '<strong>Seedha WhatsApp pe.</strong> Ek unique link milta hai jo aap apne saare family aur friend groups mein share kar sakte ho. Guests ko koi app download nahi karna, koi account nahi banana — bas link kholo, invite dekho, RSVP karo. Purane phones pe bhi perfectly kaam karta hai.' },
  { q: "Payment ke baad invite kab milega?", a: '<strong>Turant — payment confirm hote hi.</strong> Koi waiting nahi, koi approval process nahi. UPI, credit/debit card, net banking, aur Razorpay se pay kar sakte ho. Checkout 100% secure hai aur GST invoice bhi milti hai.' },
  { q: "Kya baad mein kuch bhi update ho sakta hai?", a: '<strong>Haan — hamesha aur free mein.</strong> Venue change hua? Timing shift hui? Koi nayi ceremony add karni hai? Sab kuch edit kar sakte ho. Purana link same rehta hai, aur guests ko automatically updated version dikhai deta hai. Dubara share karna bhi zaruri nahi.' },
  { q: "Kya ek invite mein Mehndi, Haldi, Baraat sab aa sakta hai?", a: '<strong>Haan, aur yahi sabse badi khaasiyat hai.</strong> Shaadi aur Shaahi plans mein unlimited events add kar sakte ho — Mehndi, Haldi, Sangeet, Baraat, Reception, Griha Pravesh — sab ek hi invitation mein. Har event ka apna time, venue, aur Google Maps link hoga.' },
  { q: "NRI ya foreign mein baithe guests ke liye koi problem hogi?", a: '<strong>Koi problem nahi.</strong> Invitation world mein kahin se bhi open ho sakta hai. Shaahi plan mein timezone auto-detection bhi hai — US, UK, ya Australia mein baithe relative ko apne local time mein event timing dikhegi.' },
  { q: "Kya invitation private rakha ja sakta hai?", a: '<strong>Haan — default hi private hai.</strong> Aapka invite kabhi bhi public search mein nahi dikhega. Password protection option bhi hai taaki sirf wahi log dekh sakein jinhein aap chahte hain.' },
  { q: "RSVP track karna kitna easy hai?", a: '<strong>Ek dashboard mein sab kuch.</strong> Kaun aa raha hai, kaun nahi, kaun ne abhi tak jawab nahi diya — sab real-time dikhta hai. Dietary preferences bhi track hoti hain. Auto-reminders un guests ko bhejte hain jinhone respond nahi kiya.' },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="section-padding bg-background relative overflow-hidden">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How do I send a digital wedding invitation on WhatsApp in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "With Shaadi.Digital, you get a unique WhatsApp-ready link after choosing your template. Share it directly to any family or friend group — guests open it instantly with no app download needed."
              }
            },
            {
              "@type": "Question",
              "name": "How much does a digital wedding invitation cost in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Shaadi.Digital plans start at ₹999 one-time with no per-guest fees. Preview is completely free — you only pay when you love it."
              }
            },
            {
              "@type": "Question",
              "name": "Can I track RSVPs from a digital wedding invitation?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Shaadi.Digital includes a live RSVP dashboard where you can see who is attending, who declined, and who hasn't responded — in real time."
              }
            },
            {
              "@type": "Question",
              "name": "Which is the best digital wedding invitation platform in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Shaadi.Digital is India's most loved digital wedding invitation platform, trusted by 50,000+ couples with a 4.9/5 rating. It supports every Indian tradition including Hindu, Muslim, Sikh, and South Indian weddings."
              }
            }
          ]
        })}</script>
      </Helmet>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,148,26,0.06) 0%, transparent 70%)",
      }} />

      <div className="relative z-[1] max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-[360px_1fr] gap-16 md:gap-20 items-start">
        {/* Sticky left panel */}
        <div className="md:sticky md:top-20">
          <div className="section-label">Got Questions?</div>
          <h2 className="section-title text-left">Aksar Pooche<br />Jaate hain jo<br /><em>Sawaal</em></h2>
          <p className="text-sm text-muted-foreground leading-[1.85] font-light mt-4">
            Koi bhi doubt ho toh neeche dekho — ya seedha humse baat karo.
          </p>
          <div className="mt-9 pt-7 border-t border-secondary/15">
            <div className="text-[10px] tracking-[2px] uppercase text-secondary font-medium mb-3">Still unsure?</div>
            <a href="https://wa.me/919999999999" className="inline-flex items-center gap-2 text-[13px] hover:text-secondary transition-colors" style={{ color: "hsl(var(--maroon-dark))" }}>
              💬 Chat with us on WhatsApp
            </a>
          </div>
        </div>

        {/* Accordion */}
        <div className="flex flex-col">
          {faqs.map((f, i) => (
            <div key={i} className={`border-b border-secondary/[0.12] cursor-pointer overflow-hidden ${i === 0 ? "border-t" : ""}`}>
              <div className="flex justify-between items-center gap-5 py-[22px] select-none" onClick={() => toggle(i)}>
                <div className="flex items-start gap-4">
                  <span className="font-serif text-[13px] text-secondary/40 italic shrink-0 mt-0.5 min-w-[20px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-serif text-[18px] font-medium leading-[1.35] transition-colors duration-200 ${openIndex === i ? "text-secondary" : ""}`} style={openIndex !== i ? { color: "hsl(var(--maroon-dark))" } : undefined}>{f.q}</span>
                </div>
                <span className={`w-7 h-7 rounded-full border border-secondary/25 flex items-center justify-center shrink-0 text-secondary text-base leading-none transition-all duration-300 ${openIndex === i ? "bg-secondary !text-[hsl(var(--maroon-dark))] !border-secondary rotate-45" : ""}`}>+</span>
              </div>
              <div className={`overflow-hidden transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${openIndex === i ? "max-h-[300px] pb-[22px]" : "max-h-0"}`}>
                <div className="pl-9 text-sm text-muted-foreground leading-[1.9] font-light [&>strong]:text-[hsl(var(--maroon-dark))] [&>strong]:font-medium" dangerouslySetInnerHTML={{ __html: f.a }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
