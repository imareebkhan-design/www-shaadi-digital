import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

const isWithinIST = () => {
  const now = new Date();
  const istHour = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getHours();
  return istHour >= 9 && istHour < 21;
};

const BuilderHelpCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(isWithinIST);

  useEffect(() => {
    const interval = setInterval(() => setIsOnline(isWithinIST()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCallback = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error("Please enter your name and number");
      return;
    }
    setSubmitting(true);
    // Simulate submission — in production this would call an edge function
    await new Promise(r => setTimeout(r, 1000));
    toast.success("We'll call you within 5 minutes!");
    setSubmitting(false);
    setShowCallbackForm(false);
    setExpanded(false);
    setName("");
    setPhone("");
  };

  return (
    <div className="fixed bottom-6 z-20 w-[260px]" style={{ right: "calc(60% + 24px)", maxWidth: "calc(40% - 48px)" }}>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 bg-card border border-border/60 rounded-lg p-4 origin-bottom"
            style={{ boxShadow: "0 8px 30px -8px hsl(20 20% 15% / 0.12)" }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/917838189916?text=Hi, I need help creating my wedding invitation on Shaadi.Digital"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
              </div>
              <span className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">Chat on WhatsApp</span>
            </a>

            {/* Callback */}
            <div className="mt-1">
              {!showCallbackForm ? (
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors w-full group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">Request a Callback</span>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 pt-2"
                >
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-body bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                  <input
                    type="tel"
                    placeholder="Your number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-body bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                  <button
                    onClick={handleCallback}
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground text-xs font-body font-semibold py-2 rounded-none hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Requesting…" : "Call me in 5 mins"}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Availability */}
            <p className="font-body text-[10px] text-muted-foreground italic text-center mt-3 pt-2 border-t border-border/40">
              Available 9am – 9pm, 7 days a week
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div
        className="bg-callout rounded-lg p-4 cursor-pointer"
        style={{ boxShadow: "0 4px 20px -4px hsl(20 20% 15% / 0.1)" }}
        onClick={() => !expanded && setExpanded(true)}
      >
        <div className="flex items-center gap-2.5 mb-1">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted-foreground/40" />
            )}
          </span>
          <span className="font-body text-sm font-semibold text-primary">Stuck? Talk to an expert</span>
        </div>
        <p className="font-body text-[11px] text-muted-foreground ml-5">
          {isOnline
            ? "We'll set it up for you in 5 mins"
            : "Leave your number — we'll call you back"
          }
        </p>
        {!expanded && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            className="mt-3 w-full bg-primary text-primary-foreground text-[11px] font-body font-semibold py-2 rounded-none hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
          >
            Connect Now <ChevronUp className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BuilderHelpCard;
