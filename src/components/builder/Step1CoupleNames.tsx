import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BuilderFormData } from "@/types/builder";
import AiStoryGenerator from "./AiStoryGenerator";
import { Heart } from "lucide-react";

interface Props {
  data: BuilderFormData;
  onChange: (data: Partial<BuilderFormData>) => void;
  errors: Record<string, string>;
  weddingType: string;
  onWeddingTypeChange: (type: string) => void;
}

const SectionDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 pt-4">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    <span className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{label}</span>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
  </div>
);

const WEDDING_TYPES = [
  { id: "hindu",    label: "Hindu",    icon: "🪔" },
  { id: "muslim",   label: "Muslim",   icon: "☪️" },
  { id: "sikh",     label: "Sikh",     icon: "🪯" },
  { id: "christian",label: "Christian",icon: "✝️" },
  { id: "other",    label: "Other",    icon: "💍" },
];

const Step1CoupleNames = ({ data, onChange, errors, weddingType, onWeddingTypeChange }: Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
          <Heart className="w-4.5 h-4.5 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-primary mb-1">Let's build your invite</h2>
        <p className="font-body text-sm text-muted-foreground">About 5 min · saves automatically</p>
      </div>

      {/* ── Wedding Type ── */}
      <div className="p-4 bg-callout/30 border border-secondary/10">
        <p className="font-body text-sm font-medium text-foreground mb-3">What type of wedding?</p>
        <div className="flex flex-wrap gap-2">
          {WEDDING_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => onWeddingTypeChange(type.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-body border transition-all ${
                weddingType === type.id
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <span style={{ fontSize: 14 }}>{type.icon}</span> {type.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          We'll show only relevant ceremonies for your wedding type
        </p>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Bride's First Name <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="e.g. Priya"
            value={data.bride_name}
            onChange={(e) => onChange({ bride_name: e.target.value })}
            className="border-border/60 focus:border-primary/40"
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
            className="border-border/60 focus:border-primary/40"
          />
          {errors.groom_name && <p className="text-xs text-destructive mt-1">{errors.groom_name}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Bride's Full Name <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <Input
            placeholder="e.g. Priya Sharma"
            value={data.bride_full_name || ""}
            onChange={(e) => onChange({ bride_full_name: e.target.value })}
            className="border-border/60 focus:border-primary/40"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Shown in the "Two Souls" section</p>
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Groom's Full Name <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <Input
            placeholder="e.g. Arjun Mehta"
            value={data.groom_full_name || ""}
            onChange={(e) => onChange({ groom_full_name: e.target.value })}
            className="border-border/60 focus:border-primary/40"
          />
          <p className="text-[11px] text-muted-foreground mt-1">Shown in the "Two Souls" section</p>
        </div>
      </div>

      <SectionDivider label="Family Details" />

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Bride's Family <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <Input
          placeholder="e.g. Daughter of Mr. Vikram & Mrs. Anjali Sharma"
          value={data.bride_family}
          onChange={(e) => onChange({ bride_family: e.target.value })}
          className="border-border/60 focus:border-primary/40"
        />
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Groom's Family <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <Input
          placeholder="e.g. Son of Mr. Rajesh & Mrs. Sunita Mehta"
          value={data.groom_family}
          onChange={(e) => onChange({ groom_family: e.target.value })}
          className="border-border/60 focus:border-primary/40"
        />
      </div>

      <SectionDivider label="About the Couple" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1">
            Bride's Bio <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <Textarea
            placeholder="e.g. An artist at heart, a dreamer by nature…"
            value={data.bride_bio || ""}
            onChange={(e) => {
              if (e.target.value.length <= 200) onChange({ bride_bio: e.target.value });
            }}
            rows={3}
            className="resize-none border-border/60 focus:border-primary/40"
          />
          <p className="text-[11px] text-muted-foreground mt-1 text-right">{(data.bride_bio || "").length}/200</p>
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1">
            Groom's Bio <span className="text-muted-foreground text-xs">(optional)</span>
          </label>
          <Textarea
            placeholder="e.g. A dreamer with a golden heart…"
            value={data.groom_bio || ""}
            onChange={(e) => {
              if (e.target.value.length <= 200) onChange({ groom_bio: e.target.value });
            }}
            rows={3}
            className="resize-none border-border/60 focus:border-primary/40"
          />
          <p className="text-[11px] text-muted-foreground mt-1 text-right">{(data.groom_bio || "").length}/200</p>
        </div>
      </div>

      <SectionDivider label="Your Words" />

      <div className="p-4 bg-callout/50 border border-secondary/15">
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Personal Message <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <p className="text-xs italic text-secondary mb-2 flex items-center gap-1">✨ Suggested — edit freely</p>
        <Textarea
          placeholder="A short message from the couple…"
          value={data.personal_message}
          onChange={(e) => {
            if (e.target.value.length <= 120) {
              onChange({ personal_message: e.target.value });
            }
          }}
          rows={3}
          className="resize-none bg-card border-border/60 focus:border-primary/40"
        />
        <p className="text-[11px] text-muted-foreground mt-1 text-right">
          {data.personal_message.length}/120 characters
        </p>
      </div>

      <div className="p-4 bg-callout/50 border border-secondary/15">
        <label className="font-body text-sm font-medium text-foreground block mb-1">
          Your Love Story <span className="text-muted-foreground text-xs">(optional)</span>
        </label>
        <p className="text-xs italic text-secondary mb-2 flex items-center gap-1">✨ Suggested — edit freely</p>
        <Textarea
          placeholder="We met on a rainy evening in Delhi, and from that very first cup of chai…"
          value={data.our_story || ""}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              onChange({ our_story: e.target.value });
            }
          }}
          rows={4}
          className="resize-none bg-card border-border/60 focus:border-primary/40"
        />
        <p className="text-[11px] text-muted-foreground mt-1 text-right">
          {(data.our_story || "").length}/300 characters
        </p>

        <AiStoryGenerator onStoryGenerated={(story) => onChange({ our_story: story })} />
      </div>
    </div>
  );
};

export default Step1CoupleNames;
