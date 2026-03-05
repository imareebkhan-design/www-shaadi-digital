import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BuilderFormData } from "@/types/builder";

interface Props {
  data: BuilderFormData;
  onChange: (data: Partial<BuilderFormData>) => void;
  errors: Record<string, string>;
}

const Step1CoupleNames = ({ data, onChange, errors }: Props) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-primary mb-1">Couple & Family Names</h2>
        <p className="font-body text-sm text-muted-foreground">Tell us who's getting married</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Bride's First Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. Priya"
            value={data.bride_name}
            onChange={(e) => onChange({ bride_name: e.target.value })}
          />
          {errors.bride_name && <p className="text-xs text-destructive mt-1">{errors.bride_name}</p>}
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Groom's First Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. Arjun"
            value={data.groom_name}
            onChange={(e) => onChange({ groom_name: e.target.value })}
          />
          {errors.groom_name && <p className="text-xs text-destructive mt-1">{errors.groom_name}</p>}
        </div>
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Bride's Family <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="e.g. daughter of Ramesh & Sunita Sharma"
          value={data.bride_family}
          onChange={(e) => onChange({ bride_family: e.target.value })}
        />
        {errors.bride_family && <p className="text-xs text-destructive mt-1">{errors.bride_family}</p>}
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Groom's Family <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="e.g. son of Vijay & Meena Kapoor"
          value={data.groom_family}
          onChange={(e) => onChange({ groom_family: e.target.value })}
        />
        {errors.groom_family && <p className="text-xs text-destructive mt-1">{errors.groom_family}</p>}
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Personal Message <span className="text-muted-foreground">(optional)</span>
        </label>
        <Textarea
          placeholder="A short message from the couple…"
          value={data.personal_message}
          onChange={(e) => {
            if (e.target.value.length <= 120) {
              onChange({ personal_message: e.target.value });
            }
          }}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {data.personal_message.length}/120 characters
        </p>
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1">
          Your Love Story <span className="text-muted-foreground">(optional)</span>
        </label>
        <p className="font-body text-xs text-muted-foreground mb-2">
          Share a few lines about how you met. This appears beautifully on your invite.
        </p>
        <Textarea
          placeholder="We met on a rainy evening in Delhi, and from that very first cup of chai…"
          value={data.our_story || ""}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              onChange({ our_story: e.target.value });
            }
          }}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {(data.our_story || "").length}/300 characters
        </p>
      </div>
    </div>
  );
};

export default Step1CoupleNames;
