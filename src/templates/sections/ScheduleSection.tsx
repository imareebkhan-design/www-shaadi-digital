import { Calendar, Clock, MapPin } from "lucide-react";
import type { InvitationEvent } from "../types";

const eventTypeEmoji: Record<string, string> = {
  mehndi: "🌿", haldi: "💛", sangeet: "🎶", baraat: "🐴", ceremony: "🪔", reception: "🎉",
};

const getDirectionsUrl = (event: InvitationEvent) => {
  if (event.maps_url) return event.maps_url;
  const query = [event.venue_name, event.venue_address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

interface Props {
  events: InvitationEvent[];
  gradient: string;
}

const ScheduleSection = ({ events, gradient }: Props) => {
  const enabled = events.filter((e) => e.is_enabled);
  if (enabled.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="section-label justify-center">Wedding Events</p>
          <h2 className="section-title">Schedule</h2>
        </div>
        <div className="space-y-6">
          {enabled.map((event) => (
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
  );
};

export default ScheduleSection;
