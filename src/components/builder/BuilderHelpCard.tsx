import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, ChevronUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const isWithinIST = () => {
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false });
  const hour = parseInt(formatter.format(new Date()), 10);
  return hour >= 9 && hour < 21;
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
    await new Promise(r => setTimeout(r, 1000));
    toast.success("We'll call you within 5 minutes!");
    setSubmitting(false);
    setShowCallbackForm(false);
    setExpanded(false);
    setName("");
    setPhone("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[220px]">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 rounded-lg p-4 origin-bottom relative"
            style={{ background: "#4A0E1F", boxShadow: "0 12px 40px -8px rgba(74,14,31,0.4)" }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-2.5 right-2.5 text-white/50 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/917838189916?text=Hi, I need help creating my wedding invitation on Shaadi.Digital"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              </div>
              <span className="font-body text-xs font-medium text-white/90 group-hover:text-white">Chat on WhatsApp</span>
            </a>

            {/* Callback */}
            <div className="mt-1">
              {!showCallbackForm ? (
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 transition-colors w-full group"
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-white/80" />
                  </div>
                  <span className="font-body text-xs font-medium text-white/90 group-hover:text-white">Request a Callback</span>
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
                    className="w-full px-3 py-2 text-xs font-body bg-white/10 border border-white/15 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <input
                    type="tel"
                    placeholder="Your number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-body bg-white/10 border border-white/15 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <button
                    onClick={handleCallback}
                    disabled={submitting}
                    className="w-full text-[11px] font-body font-semibold py-2 rounded-none transition-colors disabled:opacity-60"
                    style={{ background: "hsl(40, 65%, 55%)", color: "#4A0E1F" }}
                  >
                    {submitting ? "Requesting…" : "Call me in 5 mins"}
                  </button>
                </motion.div>
              )}
            </div>

            {/* Availability */}
            <p className="font-body text-[9px] text-white/40 italic text-center mt-3 pt-2 border-t border-white/10">
              Available 9am – 9pm, 7 days a week
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div
        className="rounded-lg p-3.5 cursor-pointer"
        style={{ background: "#4A0E1F", boxShadow: "0 8px 30px -6px rgba(74,14,31,0.35)" }}
        onClick={() => !expanded && setExpanded(true)}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-2 w-2 shrink-0">
            {isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#22c55e" }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#22c55e" }} />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white/30" />
            )}
          </span>
          <span className="font-body text-xs font-semibold text-white">Stuck? Talk to an expert</span>
        </div>
        <p className="font-body text-[10px] text-white/50 ml-4">
          {isOnline
            ? "We'll set it up for you in 5 mins"
            : "Leave your number — we'll call you back"
          }
        </p>
        {!expanded && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
            className="mt-2.5 w-full text-[10px] font-body font-bold py-1.5 rounded-none transition-colors flex items-center justify-center gap-1"
            style={{ background: "hsl(40, 65%, 55%)", color: "#4A0E1F" }}
          >
            Connect Now <ChevronUp className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BuilderHelpCard;
