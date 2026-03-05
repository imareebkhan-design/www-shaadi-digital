import { MapPin, Calendar, Clock, Share2, Calendar as CalendarIcon, Gift } from "lucide-react";
import type { InvitationData } from "./types";

interface BaseTemplateProps {
  data: InvitationData;
  isPreview?: boolean;
  gradient: string;
  motif: string;
  accentColor?: string;
}

const placeholder = (value: string | undefined, fallback: string, isPreview: boolean) =>
  value?.trim() ? value : isPreview ? fallback : value || "";

const eventTypeEmoji: Record<string, string> = {
  mehndi: "🌿",
  haldi: "💛",
  sangeet: "🎶",
  baraat: "🐴",
  ceremony: "🪔",
  reception: "🎉",
};

const getDirectionsUrl = (event: { venue_name: string; venue_address: string; maps_url?: string }) => {
  if (event.maps_url) return event.maps_url;
  const query = [event.venue_name, event.venue_address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const BaseTemplate = ({ data, isPreview = false, gradient, motif, accentColor }: BaseTemplateProps) => {
  const brideName = placeholder(data.bride_name, "Bride's Name", isPreview);
  const groomName = placeholder(data.groom_name, "Groom's Name", isPreview);
  const brideFamily = placeholder(data.bride_family, "Bride's Family", isPreview);
  const groomFamily = placeholder(data.groom_family, "Groom's Family", isPreview);
  const message = placeholder(data.personal_message, "Your personal message will appear here", isPreview);
  const enabledEvents = data.events.filter((e) => e.is_enabled);

  const formattedDate = data.wedding_date
    ? new Date(data.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : isPreview
    ? "15 December 2026"
    : null;

  const inviteUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    const text = `You're invited to ${brideName} & ${groomName}'s wedding! 💒✨\n\n${inviteUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const addToGoogleCalendar = () => {
    const mainEvent = enabledEvents.find((e) => e.event_type === "ceremony") || enabledEvents[0];
    const date = data.wedding_date || mainEvent?.event_date;
    if (!date) return;
    const d = new Date(date);
    const startStr = d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(d.getTime() + 4 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const venue = mainEvent?.venue_name || "";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${brideName} & ${groomName}'s Wedding`)}&dates=${startStr}/${endStr}&location=${encodeURIComponent(venue)}`;
    window.open(url, "_blank");
  };

  const addToAppleCalendar = () => {
    const mainEvent = enabledEvents.find((e) => e.event_type === "ceremony") || enabledEvents[0];
    const date = data.wedding_date || mainEvent?.event_date;
    if (!date) return;
    const d = new Date(date);
    const startStr = d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const endDate = new Date(d.getTime() + 4 * 60 * 60 * 1000);
    const endStr = endDate.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      `DTSTART:${startStr}`, `DTEND:${endStr}`,
      `SUMMARY:${brideName} & ${groomName}'s Wedding`,
      `LOCATION:${mainEvent?.venue_name || ""}`,
      "END:VEVENT", "END:VCALENDAR",
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
    <div className="min-h-screen bg-background">
      {/* ─── HERO ─── */}
      <section className={`min-h-[90vh] bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ccircle cx='150' cy='150' r='140' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3Ccircle cx='150' cy='150' r='110' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3Ccircle cx='150' cy='150' r='80' fill='none' stroke='%23C9941A' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px", backgroundPosition: "center",
        }} />
        <div className="relative z-10">
          <div className="text-secondary text-3xl mb-6">{motif}</div>
          <p className="font-serif text-xs tracking-[4px] uppercase text-white/50 mb-8">Together with their families</p>
          {brideFamily && <p className="font-serif text-sm text-white/60 italic mb-1">{brideFamily}</p>}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{brideName}</h1>
          <p className="font-serif text-2xl text-secondary italic my-3">&</p>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-2">{groomName}</h1>
          {groomFamily && <p className="font-serif text-sm text-white/60 italic mt-1">{groomFamily}</p>}
          <div className="w-16 h-px bg-secondary mx-auto my-8" />
          {formattedDate && <p className="font-body text-sm tracking-[2px] uppercase text-white/70">{formattedDate}</p>}
          <div className="text-secondary/40 text-2xl mt-10">{motif}</div>
        </div>
      </section>

      {/* ─── PHOTO ─── */}
      {(data.photo_url || isPreview) && (
        <section className="py-12 px-6 bg-card">
          <div className="max-w-md mx-auto">
            {data.photo_url ? (
              <img src={data.photo_url} alt={`${brideName} & ${groomName}`} className="w-full aspect-[4/3] object-cover border-4 border-secondary/20" loading="lazy" />
            ) : isPreview ? (
              <div className="w-full aspect-[4/3] bg-muted border-4 border-secondary/20 flex items-center justify-center text-muted-foreground text-sm font-body">
                Couple Photo
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* ─── MESSAGE ─── */}
      {message && (
        <section className="py-12 px-6 bg-background">
          <div className="max-w-lg mx-auto text-center">
            <div className="text-secondary text-2xl mb-4">✉</div>
            <p className="font-serif text-lg md:text-xl italic text-foreground/80 leading-relaxed">"{message}"</p>
            <div className="w-12 h-px bg-secondary mx-auto mt-6" />
          </div>
        </section>
      )}

      {/* ─── EVENTS ─── */}
      {enabledEvents.length > 0 && (
        <section className="py-16 px-6 bg-card">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs tracking-[3px] uppercase text-secondary font-medium mb-2">Wedding Events</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>Celebrations</h2>
              <div className="w-12 h-px bg-secondary mx-auto mt-4" />
            </div>
            <div className="space-y-6">
              {enabledEvents.map((event) => (
                <div key={event.event_type} className="border border-secondary/20 bg-background p-6 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`} />
                  <div className="pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{eventTypeEmoji[event.event_type] || "🎊"}</span>
                      <h3 className="font-display text-lg font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>{event.event_name}</h3>
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-secondary shrink-0" />
                          <span>{new Date(event.event_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                      )}
                      {event.event_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary shrink-0" />
                          <span>{event.event_time}</span>
                        </div>
                      )}
                      {event.venue_name && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-secondary shrink-0" />
                          <span className="font-medium text-foreground">{event.venue_name}</span>
                        </div>
                      )}
                      {event.venue_address && <p className="pl-6 text-xs text-muted-foreground">{event.venue_address}</p>}
                    </div>
                    {(event.venue_name || event.venue_address || event.maps_url) && (
                      <a href={getDirectionsUrl(event)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-secondary hover:text-primary transition-colors uppercase tracking-[0.5px]">
                        <MapPin className="w-3.5 h-3.5" /> Get Directions
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FAMILY ─── */}
      {(brideFamily || groomFamily) && (
        <section className="py-14 px-6 bg-background">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-xs tracking-[3px] uppercase text-secondary font-medium mb-2">With blessings of</p>
            <h2 className="font-display text-2xl font-bold mb-8" style={{ color: "hsl(var(--maroon-dark))" }}>Our Families</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {brideFamily && (
                <div className="border border-secondary/20 bg-card p-6">
                  <p className="font-display text-lg font-bold text-primary mb-1">{brideName}'s Family</p>
                  <p className="font-serif text-sm italic text-muted-foreground">{brideFamily}</p>
                </div>
              )}
              {groomFamily && (
                <div className="border border-secondary/20 bg-card p-6">
                  <p className="font-display text-lg font-bold text-primary mb-1">{groomName}'s Family</p>
                  <p className="font-serif text-sm italic text-muted-foreground">{groomFamily}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── RSVP CTA ─── */}
      <section className="py-16 px-6 bg-card text-center">
        <div className="max-w-md mx-auto">
          <div className="text-4xl mb-4">💍</div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3" style={{ color: "hsl(var(--maroon-dark))" }}>
            Will you be joining us?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{brideName} & {groomName} would love to celebrate with you</p>
          <button
            onClick={() => document.getElementById("rsvp-form")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary text-primary-foreground px-10 py-4 text-[13px] font-medium tracking-[1px] uppercase hover:bg-secondary transition-colors"
          >
            RSVP Now 💌
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 bg-foreground">
        <div className="max-w-md mx-auto text-center">
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

          {(data.upi_id || data.gift_registry_url) && (
            <div className="border-t border-white/10 pt-6 mb-8">
              <p className="text-xs text-white/40 uppercase tracking-[2px] mb-3">Blessings & Gifts</p>
              <div className="flex flex-wrap justify-center gap-3">
                {data.upi_id && (
                  <a href={`upi://pay?pa=${encodeURIComponent(data.upi_id)}&pn=${encodeURIComponent(`${brideName} & ${groomName}`)}`}
                    className="flex items-center gap-2 bg-secondary/20 text-secondary px-5 py-2.5 text-xs font-medium tracking-[0.5px] uppercase hover:bg-secondary/30 transition-colors">
                    <Gift className="w-4 h-4" /> Send Gift (UPI)
                  </a>
                )}
                {data.gift_registry_url && (
                  <a href={data.gift_registry_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-secondary/30 text-secondary px-5 py-2.5 text-xs font-medium tracking-[0.5px] uppercase hover:bg-secondary/10 transition-colors">
                    <Gift className="w-4 h-4" /> Gift Registry
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="text-xs text-white/30 mt-4">
            Made with ❤️ on <span className="font-display">Shaadi<span className="text-secondary">.</span>Digital</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BaseTemplate;
