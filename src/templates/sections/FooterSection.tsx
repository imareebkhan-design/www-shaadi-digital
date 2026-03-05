import { Share2, Calendar as CalendarIcon } from "lucide-react";

interface Props {
  brideName: string;
  groomName: string;
  weddingDate: string;
  events: { event_type: string; event_date: string; event_time: string; venue_name: string; is_enabled: boolean }[];
}

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
    <footer className="py-12 px-6 bg-foreground">
      <div className="max-w-md mx-auto text-center">
        {/* Names & date */}
        <h3 className="font-display text-2xl font-bold text-white mb-1">{brideName} & {groomName}</h3>
        {formattedDate && <p className="font-body text-xs tracking-[2px] uppercase text-white/40 mb-8">{formattedDate}</p>}

        {/* Share & calendar buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button onClick={shareWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-xs font-medium tracking-[0.5px] uppercase hover:bg-[#128C7E] transition-colors">
            <Share2 className="w-4 h-4" /> Share on WhatsApp
          </button>
          <button onClick={addToGoogleCalendar} className="flex items-center gap-2 border border-white/20 text-white/70 px-5 py-3 text-xs font-medium tracking-[0.5px] uppercase hover:text-white hover:border-white/40 transition-colors">
            <CalendarIcon className="w-4 h-4" /> Google Calendar
          </button>
          <button onClick={addToAppleCalendar} className="flex items-center gap-2 border border-white/20 text-white/70 px-5 py-3 text-xs font-medium tracking-[0.5px] uppercase hover:text-white hover:border-white/40 transition-colors">
            <CalendarIcon className="w-4 h-4" /> Apple Calendar
          </button>
        </div>

        <p className="text-xs text-white/30 mt-4">
          Made with ❤️ on <span className="font-display">Shaadi<span className="text-secondary">.</span>Digital</span>
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
