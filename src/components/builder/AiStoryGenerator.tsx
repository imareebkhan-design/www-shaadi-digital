import { useState } from "react";
import { Sparkles, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  onStoryGenerated: (story: string) => void;
}

const meetOptions = ["At college", "Through family", "At work", "On an app", "Known forever"];
const feelOptions = ["Calm & steady", "Electric", "Warm & cozy", "Full of laughter", "Meant to be"];

const Pill = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-body transition-all ${
      selected
        ? "bg-primary text-primary-foreground"
        : "bg-background border border-border text-foreground hover:border-primary/40"
    }`}
  >
    {label}
  </button>
);

const AiStoryGenerator = ({ onStoryGenerated }: Props) => {
  const [phase, setPhase] = useState<"button" | "q1" | "q2" | "loading" | "done">("button");
  const [howMet, setHowMet] = useState("");
  const [feelsLike, setFeelsLike] = useState("");

  const generateStory = async (met: string, feels: string) => {
    setPhase("loading");
    try {
      const { data, error } = await supabase.functions.invoke("generate-love-story", {
        body: { how_we_met: met, one_word: feels },
      });
      if (error) throw error;
      if (data?.story) {
        onStoryGenerated(data.story);
        setPhase("done");
      } else if (data?.error) {
        toast.error(data.error);
        setPhase("q2");
      }
    } catch {
      toast.error("Failed to generate story. Please try again.");
      setPhase("q2");
    }
  };

  const handleRegenerate = () => {
    generateStory(howMet, feelsLike);
  };

  const handleAccept = () => {
    setPhase("button");
    setHowMet("");
    setFeelsLike("");
  };

  if (phase === "button") {
    return (
      <button
        type="button"
        onClick={() => setPhase("q1")}
        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-body text-xs hover:bg-primary/90 transition-colors rounded-none"
      >
        <Sparkles className="w-3.5 h-3.5" /> Personalise with AI
      </button>
    );
  }

  if (phase === "done") {
    return (
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleRegenerate}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-body text-xs hover:bg-primary/90 transition-colors rounded-none"
        >
          <Sparkles className="w-3.5 h-3.5" /> Regenerate
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-primary text-primary font-body text-xs hover:bg-primary/5 transition-colors rounded-none"
        >
          <Check className="w-3.5 h-3.5" /> Looks good
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 bg-callout rounded-lg"
    >
      <AnimatePresence mode="wait">
        {/* Question 1 */}
        <motion.div key="q1" layout>
          <p className="font-body text-sm text-foreground mb-2">How did you two first meet?</p>
          <div className="flex flex-wrap gap-2">
            {meetOptions.map((opt) => (
              <Pill
                key={opt}
                label={opt}
                selected={howMet === opt}
                onClick={() => {
                  setHowMet(opt);
                  if (phase === "q1") setPhase("q2");
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {(phase === "q2" || phase === "loading") && (
          <motion.div
            key="q2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <p className="font-body text-sm text-foreground mb-2">What does your relationship feel like?</p>
            <div className="flex flex-wrap gap-2">
              {feelOptions.map((opt) => (
                <Pill
                  key={opt}
                  label={opt}
                  selected={feelsLike === opt}
                  onClick={() => {
                    setFeelsLike(opt);
                    generateStory(howMet, opt);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "loading" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-body text-sm italic text-secondary flex items-center gap-2"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Crafting your story...
        </motion.p>
      )}
    </motion.div>
  );
};

export default AiStoryGenerator;
