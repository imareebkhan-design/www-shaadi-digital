import { Button } from "@/components/ui/button";

const CTABanner = () => (
  <section className="section-padding bg-primary relative overflow-hidden">
    <div className="absolute inset-0 mandala-bg opacity-30" />
    <div className="relative container text-center max-w-3xl">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
        Your Love Story Deserves
        <br />
        <span className="text-secondary">A Beautiful Invitation</span>
      </h2>
      <p className="font-body text-primary-foreground/70 text-base mb-8 max-w-xl mx-auto">
        Join thousands of Indian couples who chose digital. Create your personalised wedding invite in under 10 minutes.
      </p>
      <Button
        size="lg"
        className="font-body text-base px-10 py-6 bg-secondary text-foreground hover:bg-secondary/90"
      >
        Create Your Invite — Free to Start
      </Button>
    </div>
  </section>
);

export default CTABanner;
