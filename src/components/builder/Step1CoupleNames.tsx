import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BuilderFormData } from "@/types/builder";
import AiStoryGenerator from "./AiStoryGenerator";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Bride's Full Name <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="e.g. Priya Sharma"
            value={data.bride_full_name || ""}
            onChange={(e) => onChange({ bride_full_name: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Shown in the "Two Souls" section</p>
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1.5">
            Groom's Full Name <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            placeholder="e.g. Arjun Mehta"
            value={data.groom_full_name || ""}
            onChange={(e) => onChange({ groom_full_name: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">Shown in the "Two Souls" section</p>
        </div>
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Bride's Family <span className="text-destructive">*</span>
        </label>
        <Input
          placeholder="e.g. Daughter of Mr. Vikram & Mrs. Anjali Sharma"
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
          placeholder="e.g. Son of Mr. Rajesh & Mrs. Sunita Mehta"
          value={data.groom_family}
          onChange={(e) => onChange({ groom_family: e.target.value })}
        />
        {errors.groom_family && <p className="text-xs text-destructive mt-1">{errors.groom_family}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1">
            Bride's Bio <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            placeholder="e.g. An artist at heart, a dreamer by nature…"
            value={data.bride_bio || ""}
            onChange={(e) => {
              if (e.target.value.length <= 200) onChange({ bride_bio: e.target.value });
            }}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">{(data.bride_bio || "").length}/200</p>
        </div>
        <div>
          <label className="font-body text-sm font-medium text-foreground block mb-1">
            Groom's Bio <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            placeholder="e.g. A dreamer with a golden heart…"
            value={data.groom_bio || ""}
            onChange={(e) => {
              if (e.target.value.length <= 200) onChange({ groom_bio: e.target.value });
            }}
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">{(data.groom_bio || "").length}/200</p>
        </div>
      </div>

      <div>
        <label className="font-body text-sm font-medium text-foreground block mb-1.5">
          Personal Message <span className="text-muted-foreground">(optional)</span>
        </label>
        <p className="text-xs italic text-secondary mb-1.5">✨ Suggested — edit freely</p>
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
        <p className="text-xs italic text-secondary mb-1.5">✨ Suggested — edit freely</p>
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

        {/* AI Story Generator */}
        {!showAiFields ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 rounded-none border-secondary text-secondary hover:bg-secondary/10 font-body text-xs"
            onClick={() => setShowAiFields(true)}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Write with AI
          </Button>
        ) : (
          <div className="mt-3 space-y-3 p-3 border border-secondary/30 bg-accent/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs text-muted-foreground block mb-1">How did you meet?</label>
                <Select value={howWeMet} onValueChange={setHowWeMet}>
                  <SelectTrigger className="rounded-none text-sm">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Family Introduction">Family Introduction</SelectItem>
                    <SelectItem value="Dating App">Dating App</SelectItem>
                    <SelectItem value="Childhood Friends">Childhood Friends</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-body text-xs text-muted-foreground block mb-1">One word to describe it</label>
                <Input
                  placeholder="e.g. magical"
                  value={oneWord}
                  onChange={(e) => setOneWord(e.target.value)}
                  className="rounded-none"
                />
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-body text-xs"
              onClick={handleGenerateStory}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Generating…</>
              ) : (
                <>Generate →</>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1CoupleNames;
