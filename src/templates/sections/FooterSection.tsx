import { motion } from "framer-motion";
import { Heart, Share2, Calendar as CalendarIcon } from "lucide-react";

interface Props {
  brideName: string;
  groomName: string;
  weddingDate: string;
  events: { event_type: string; event_date: string; event_time: string; venue_name: string; is_enabled: boolean }[];
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const FooterSection = ({ brideName, groomName, weddingDate, events }: Props) => {
  const inviteUrl = typeof window !== "undefined" ? window.location.href : "";
  const enabledEvents = events.filter((e) => e.is_enabled);

  const shareWhatsApp = () => {
    const text = `You're invited! 🎊 ${brideName} & ${groomName}'s Wedding ✨\n\n${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const addToGoogleCalendar = () => {
    const mainEvent = enabledEvents.find((e) => e.event_type === "ceremony") || enabledEvents[0];
    const date = weddingDate || mainEvent?.event_date;
    if (!date) return;
    const d = new Date(date);
    const startStr = d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(d.getTime() + 4 * 3600000);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${brideName} & ${groomName}'s Wedding`)}&dates=${startStr}/${endStr}&location=${encodeURIComponent(mainEvent?.venue_name || "")}`;
    window.open(url, "_blank");
  };

  const addToAppleCalendar = () => {
    const mainEvent = enabledEvents.find((e) => e.event_type === "ceremony") || enabledEvents[0];
    const date = weddingDate || mainEvent?.event_date;
    if (!date) return;
    const d = new Date(date);
    const startStr = d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const endDate = new Date(d.getTime() + 4 * 3600000);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${startStr}`, `DTEND:${endStr}`, `SUMMARY:${brideName} & ${groomName}'s Wedding`, `LOCATION:${mainEvent?.venue_name || ""}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brideName}-${groomName}-wedding.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <footer className="py-20 md:py-28 bg-burgundy text-center relative overflow-hidden">
      {/* Gradient mesh */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container max-w-2xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1, ease }}
            className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-10"
          >
            <Heart className="w-5 h-5 text-gold/60" />
          </motion.div>

          <h2 className="font-display text-primary-foreground text-4xl md:text-6xl lg:text-7xl mb-4 leading-tight">
            {brideName} & {groomName}
          </h2>
          {formattedDate && (
            <p className="font-elegant text-gold-light/40 text-lg md:text-xl tracking-[0.2em]">
              {formattedDate.split(" ").join(" · ")}
            </p>
          )}

          {/* Share & Calendar buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={shareWhatsApp}
              className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 px-5 py-2.5 rounded-full hover:bg-[#25D366]/30 transition-all duration-300"
            >
              <Share2 className="w-3.5 h-3.5" /> WhatsApp
            </button>
            <button
              onClick={addToGoogleCalendar}
              className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase bg-primary-foreground/5 text-primary-foreground/60 border border-gold/20 px-5 py-2.5 rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Google Cal
            </button>
            <button
              onClick={addToAppleCalendar}
              className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase bg-primary-foreground/5 text-primary-foreground/60 border border-gold/20 px-5 py-2.5 rounded-full hover:bg-primary-foreground/10 transition-all duration-300"
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Apple Cal
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8">
            <div className="h-px w-16 bg-gold/20" />
            <p className="font-elegant text-primary-foreground/30 text-sm italic">
              Two hearts, one love story
            </p>
            <div className="h-px w-16 bg-gold/20" />
          </div>

          <p className="mt-16 font-body text-[9px] text-primary-foreground/15 tracking-[0.4em] uppercase">
            Made with ❤️ on Shaadi.Digital
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
