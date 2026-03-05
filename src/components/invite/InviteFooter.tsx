import { Share2, Calendar as CalendarIcon, Gift } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Event = Tables<"events">;

interface Props {
  invitation: Invitation;
  events: Event[];
  brideName: string;
  groomName: string;
}

const InviteFooter = ({ invitation, events, brideName, groomName }: Props) => {
  const inviteUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    const text = `You're invited to ${brideName} & ${groomName}'s wedding! 💒✨\n\n${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const addToGoogleCalendar = () => {
    const mainEvent = events.find(e => e.event_type === "ceremony") || events[0];
    const date = invitation.wedding_date || mainEvent?.event_date;
    if (!date) return;

    const d = new Date(date);
    const startStr = d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(d.getTime() + 4 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const venue = mainEvent?.venue_name || "";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${brideName} & ${groomName}'s Wedding`)}&dates=${startStr}/${endStr}&location=${encodeURIComponent(venue)}&details=${encodeURIComponent(`Wedding celebration of ${brideName} & ${groomName}`)}`;
    window.open(url, "_blank");
  };

  const addToAppleCalendar = () => {
    const mainEvent = events.find(e => e.event_type === "ceremony") || events[0];
    const date = invitation.wedding_date || mainEvent?.event_date;
    if (!date) return;

    const d = new Date(date);
    const startStr = d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const endDate = new Date(d.getTime() + 4 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${brideName} & ${groomName}'s Wedding`,
      `LOCATION:${mainEvent?.venue_name || ""}`,
      `DESCRIPTION:Wedding celebration of ${brideName} & ${groomName}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brideName}-${groomName}-wedding.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <footer className="py-12 px-6 bg-foreground">
      <div className="max-w-md mx-auto text-center">
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={shareWhatsApp}
            className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 text-xs font-medium tracking-[0.5px] uppercase hover:bg-[#128C7E] transition-colors"
          >
            <Share2 className="w-4 h-4" /> Share on WhatsApp
          </button>

          <button
            onClick={addToGoogleCalendar}
            className="flex items-center gap-2 border border-white/20 text-white/70 px-5 py-3 text-xs font-medium tracking-[0.5px] uppercase hover:text-white hover:border-white/40 transition-colors"
          >
            <CalendarIcon className="w-4 h-4" /> Google Calendar
          </button>

          <button
            onClick={addToAppleCalendar}
            className="flex items-center gap-2 border border-white/20 text-white/70 px-5 py-3 text-xs font-medium tracking-[0.5px] uppercase hover:text-white hover:border-white/40 transition-colors"
          >
            <CalendarIcon className="w-4 h-4" /> Apple Calendar
          </button>
        </div>

        {/* UPI / Gift */}
        {(invitation.upi_id || invitation.gift_registry_url) && (
          <div className="border-t border-white/10 pt-6 mb-8">
            <p className="text-xs text-white/40 uppercase tracking-[2px] mb-3">Blessings & Gifts</p>
            <div className="flex flex-wrap justify-center gap-3">
              {invitation.upi_id && (
                <a
                  href={`upi://pay?pa=${encodeURIComponent(invitation.upi_id)}&pn=${encodeURIComponent(`${brideName} & ${groomName}`)}`}
                  className="flex items-center gap-2 bg-secondary/20 text-secondary px-5 py-2.5 text-xs font-medium tracking-[0.5px] uppercase hover:bg-secondary/30 transition-colors"
                >
                  <Gift className="w-4 h-4" /> Send Gift (UPI)
                </a>
              )}
              {invitation.gift_registry_url && (
                <a
                  href={invitation.gift_registry_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-secondary/30 text-secondary px-5 py-2.5 text-xs font-medium tracking-[0.5px] uppercase hover:bg-secondary/10 transition-colors"
                >
                  <Gift className="w-4 h-4" /> Gift Registry
                </a>
              )}
            </div>
          </div>
        )}

        {/* Branding */}
        <p className="text-xs text-white/30 mt-4">
          Made with ❤️ on <span className="font-display">Shaadi<span className="text-secondary">.</span>Digital</span>
        </p>
      </div>
    </footer>
  );
};

export default InviteFooter;
