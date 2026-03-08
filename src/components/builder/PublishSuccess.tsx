import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getWhatsAppMessage, getWhatsAppShareUrl } from "@/lib/share-messages";

interface Props {
  brideName: string;
  groomName: string;
  slug: string;
  weddingDate?: string;
  weddingCity?: string;
  language?: string;
}

const PublishSuccess = ({ brideName, groomName, slug, weddingDate, weddingCity, language }: Props) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const confettiFired = useRef(false);

  const inviteUrl = `${window.location.origin}/invite/${slug}`;

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : undefined;

  useEffect(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;

    import("canvas-confetti").then((mod) => {
      const fire = mod.default;
      const colors = ["#7B1C2E", "#E8B84B", "#C9941A", "#ffffff"];
      fire({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors });
      setTimeout(() => fire({ particleCount: 50, spread: 100, origin: { y: 0.5 }, colors }), 300);
    });
  }, []);

  const shareWhatsApp = () => {
    const text = getWhatsAppMessage({
      brideName,
      groomName,
      formattedDate,
      city: weddingCity,
      inviteUrl,
      language,
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 text-center max-w-md mx-auto py-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-6xl"
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-2">
          Your invitation is live!
        </h2>
        <p className="font-display text-base text-foreground/80">
          {brideName} &amp; {groomName}
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 bg-muted/50 border border-border px-4 py-2.5 mx-auto max-w-xs">
          <span className="text-xs text-muted-foreground truncate font-body">{inviteUrl}</span>
          <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="text-primary shrink-0">
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span className="font-body tracking-wider uppercase">Share with your guests</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          onClick={shareWhatsApp}
          className="w-full rounded-none h-12 font-body text-sm gap-2 bg-[#25D366] text-white hover:bg-[#25D366]/90 shadow-md"
        >
          💬 Share on WhatsApp
        </Button>

        <Button
          onClick={copyLink}
          variant="outline"
          className="w-full rounded-none h-11 font-body text-sm gap-2 border-border"
        >
          {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-left space-y-3 border border-border bg-muted/30 p-5"
      >
        <p className="font-body text-xs font-semibold text-foreground tracking-wider uppercase">What happens next</p>
        {[
          "Guests open your link and RSVP",
          "Responses appear in your dashboard",
          "Edit details anytime — link stays the same",
        ].map((text) => (
          <span key={text} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
            <Check className="w-3.5 h-3.5 text-secondary mt-0.5 shrink-0" />
            {text}
          </span>
        ))}
      </motion.div>

      <Button
        onClick={() => navigate("/dashboard")}
        className="w-full rounded-none h-12 font-body text-sm gap-2 bg-primary text-primary-foreground"
      >
        Go to RSVP Dashboard <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default PublishSuccess;
