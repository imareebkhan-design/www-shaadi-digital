import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PhoneDemoSection from "@/components/landing/PhoneDemoSection";
import WhyDigitalSection from "@/components/landing/WhyDigitalSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TemplateGallerySection from "@/components/landing/TemplateGallerySection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/landing/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Digital Wedding Invitations India | Shaadi.Digital"
        description="India's most loved digital wedding invitations. 12+ templates for every tradition — Punjabi, South Indian, Muslim & more. WhatsApp delivery, live RSVP tracking. Starting ₹999."
        canonical="https://shaadi.digital/"
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Shaadi.Digital",
          "description": "India's most loved digital wedding invitation platform with 12+ templates, WhatsApp delivery, and live RSVP tracking.",
          "applicationCategory": "Wedding Planning",
          "operatingSystem": "Web, iOS, Android",
          "offers": {
            "@type": "Offer",
            "price": "999",
            "priceCurrency": "INR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "50000"
          },
          "url": "https://shaadi.digital"
        }}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Shaadi.Digital",
          "url": "https://shaadi.digital",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://shaadi.digital/templates?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>
      <Navbar />
      <HeroSection />
      <PhoneDemoSection />
      <WhyDigitalSection />
      <HowItWorksSection />
      <TemplateGallerySection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTABanner />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
