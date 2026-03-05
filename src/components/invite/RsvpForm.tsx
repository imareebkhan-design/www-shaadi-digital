import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Props {
  invitationId: string;
  brideName: string;
  groomName: string;
}

const mealOptions = [
  { value: "veg", label: "🥬 Veg" },
  { value: "non_veg", label: "🍗 Non-Veg" },
  { value: "jain", label: "🙏 Jain" },
  { value: "no_preference", label: "😊 No Preference" },
] as const;

const RsvpForm = ({ invitationId, brideName, groomName }: Props) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [mealPreference, setMealPreference] = useState<"veg" | "non_veg" | "jain" | "no_preference">("no_preference");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const trimmedName = guestName.trim();
    if (!trimmedName) errs.guestName = "Please enter your name";
    else if (trimmedName.length > 100) errs.guestName = "Name must be under 100 characters";
    if (guestCount < 1) errs.guestCount = "At least 1 guest";
    if (guestCount > 10) errs.guestCount = "Maximum 10 guests";
    if (note.length > 200) errs.note = "Note must be under 200 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await supabase.from("rsvps").insert({
      invitation_id: invitationId,
      guest_name: guestName.trim(),
      guest_count: guestCount,
      meal_preference: mealPreference,
      note: note.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 px-6 bg-background">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h3 className="font-display text-2xl font-bold mb-3" style={{ color: "hsl(var(--maroon-dark))" }}>
            Your RSVP has been received!
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {brideName} & {groomName} can't wait to celebrate with you 🎉
          </p>
          <div className="w-12 h-px bg-secondary mx-auto mt-8" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[3px] uppercase text-secondary font-medium mb-2">RSVP</p>
          <h2 className="font-display text-2xl font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
            Confirm Your Attendance
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <Label className="font-body text-sm font-medium">Full Name *</Label>
            <Input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Sharma Family"
              maxLength={100}
              className="mt-1.5"
            />
            {errors.guestName && <p className="text-xs text-destructive mt-1">{errors.guestName}</p>}
          </div>

          {/* Guest Count */}
          <div>
            <Label className="font-body text-sm font-medium">Number of Guests *</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={guestCount}
              onChange={(e) => setGuestCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="mt-1.5"
            />
            {errors.guestCount && <p className="text-xs text-destructive mt-1">{errors.guestCount}</p>}
          </div>

          {/* Meal Preference */}
          <div>
            <Label className="font-body text-sm font-medium mb-3 block">Meal Preference</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMealPreference(opt.value)}
                  className={`p-3 text-sm font-medium border transition-all ${
                    mealPreference === opt.value
                      ? "border-secondary bg-secondary/10 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-secondary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <Label className="font-body text-sm font-medium">
              Note to the couple <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="A special message for the couple..."
              maxLength={200}
              rows={3}
              className="mt-1.5"
            />
            <p className="text-xs text-muted-foreground text-right mt-1">{note.length}/200</p>
            {errors.note && <p className="text-xs text-destructive mt-1">{errors.note}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-4 text-[13px] font-medium tracking-[1px] uppercase hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Send RSVP 💌"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default RsvpForm;
