import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How long does it take to create an invite?", a: "Most couples go from template selection to a published invite in under 10 minutes. The guided wizard walks you through every step." },
  { q: "Can I edit my invite after publishing?", a: "Yes! You can update names, dates, venues, and photos anytime. Changes go live instantly — no reprints needed." },
  { q: "What payment methods do you accept?", a: "We accept UPI, Net Banking, Credit/Debit Cards, and popular wallets through Razorpay — India's most trusted payment gateway." },
  { q: "Is my data secure?", a: "Absolutely. Your data is encrypted at rest and in transit. We never share your personal information with third parties." },
  { q: "Do guests need an app to view the invite?", a: "No app needed. Your invite opens beautifully in any mobile browser. Guests simply tap the WhatsApp link you share." },
  { q: "Can I use this for a destination wedding or NRI guests?", a: "Yes! Your digital invite is accessible from anywhere in the world. NRI family members love it — no postal delays, no lost cards." },
  { q: "What languages are supported?", a: "We currently support English, Hindi, Tamil, Punjabi, and Urdu — with more regional languages coming soon." },
];

const FAQSection = () => (
  <section id="faq" className="section-padding bg-card">
    <div className="container max-w-3xl">
      <div className="text-center mb-12">
        <p className="font-serif italic text-secondary text-base mb-2">Got Questions?</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Frequently Asked Questions
        </h2>
        <div className="gold-divider" />
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border bg-background px-6 data-[state=open]:border-secondary transition-colors"
          >
            <AccordionTrigger className="font-display text-sm md:text-base font-semibold text-foreground hover:no-underline py-5">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="font-body text-sm text-muted-foreground pb-5 leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
