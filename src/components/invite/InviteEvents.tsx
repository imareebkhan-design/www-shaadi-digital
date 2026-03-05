import { MapPin, Calendar, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

interface Props {
  events: Event[];
  gradientClass: string;
}

const eventTypeEmoji: Record<string, string> = {
  mehndi: "🌿",
  haldi: "💛",
  sangeet: "🎶",
  baraat: "🐴",
  ceremony: "🪔",
  reception: "🎉",
};

const getDirectionsUrl = (event: Event) => {
  if (event.maps_url) return event.maps_url;
  const query = [event.venue_name, event.venue_address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const InviteEvents = ({ events, gradientClass }: Props) => (
  <section className="py-16 px-6 bg-card">
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[3px] uppercase text-secondary font-medium mb-2">Wedding Events</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
          Celebrations
        </h2>
        <div className="w-12 h-px bg-secondary mx-auto mt-4" />
      </div>

      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-secondary/20 bg-background p-6 relative overflow-hidden"
          >
            {/* Accent bar */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientClass}`} />

            <div className="pl-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{eventTypeEmoji[event.event_type] || "🎊"}</span>
                <h3 className="font-display text-lg font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
                  {event.event_name}
                </h3>
              </div>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                {event.event_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <span>
                      {new Date(event.event_date).toLocaleDateString("en-IN", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })}
                    </span>
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

                {event.venue_address && (
                  <p className="pl-6 text-xs text-muted-foreground">{event.venue_address}</p>
                )}
              </div>

              {(event.venue_name || event.venue_address || event.maps_url) && (
                <a
                  href={getDirectionsUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-secondary hover:text-primary transition-colors uppercase tracking-[0.5px]"
                >
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

export default InviteEvents;
