import AnimateIn from "@/components/AnimateIn";

interface Props {
  brideName: string;
  groomName: string;
}

const RsvpSection = ({ brideName, groomName }: Props) => (
  <section className="py-16 px-6 bg-background text-center">
    <AnimateIn>
      <div className="max-w-md mx-auto">
        <div className="text-4xl mb-4">💍</div>
        <h2 className="section-title mb-3">Will you be joining us?</h2>
        <p className="text-sm text-muted-foreground mb-6">{brideName} & {groomName} would love to celebrate with you</p>
        <button
          onClick={() => document.getElementById("rsvp-form")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-primary text-primary-foreground px-10 py-4 text-[13px] font-medium tracking-[1px] uppercase hover:bg-secondary transition-colors"
        >
          RSVP Now 💌
        </button>
      </div>
    </AnimateIn>
  </section>
);

export default RsvpSection;
