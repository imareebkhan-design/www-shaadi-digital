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
        title="Shaadi.Digital — Premium Digital Wedding Invitations for India"
        description="Create stunning digital wedding invitations for Indian weddings — Hindu, Muslim, Sikh & South Indian. Share via WhatsApp. RSVP tracking, music & more."
        canonical="https://shaadi.digital/"
        ogTitle="Shaadi.Digital — Premium Digital Wedding Invitations for India"
        ogDescription="Create stunning digital wedding invitations for Indian weddings. Beautiful templates, WhatsApp sharing, RSVP tracking & more."
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
