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
        description="India's most loved digital wedding invitations. 200+ templates for every tradition — Punjabi, South Indian, Muslim & more. WhatsApp delivery, live RSVP tracking. Starting ₹999."
        canonical="https://shaadi.digital/"
      />
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
