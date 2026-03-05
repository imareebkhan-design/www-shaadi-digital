import { MapPin, Navigation } from "lucide-react";
import type { InvitationEvent } from "../types";

interface Props {
  events: InvitationEvent[];
}

const VenueMapSection = ({ events }: Props) => {
  // Find the main ceremony event, or first enabled event
  const mainEvent = events.find((e) => e.is_enabled && e.event_type === "ceremony") || events.find((e) => e.is_enabled);
  if (!mainEvent || (!mainEvent.venue_name && !mainEvent.venue_address)) return null;

  const query = [mainEvent.venue_name, mainEvent.venue_address].filter(Boolean).join(", ");
  const mapsUrl = mainEvent.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <section className="py-16 px-6 bg-card">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          <p className="section-label justify-center">Find Us</p>
          <h2 className="section-title">Venue</h2>
        </div>

        {/* Embedded map */}
        <div className="w-full aspect-[16/9] border border-secondary/20 mb-6 overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue Map"
          />
        </div>

        <div className="text-center">
          {mainEvent.venue_name && (
            <h3 className="font-display text-lg font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>{mainEvent.venue_name}</h3>
          )}
          {mainEvent.venue_address && (
            <p className="text-sm text-muted-foreground mt-1">{mainEvent.venue_address}</p>
          )}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 bg-primary text-primary-foreground px-6 py-3 text-xs font-medium tracking-[1px] uppercase hover:bg-primary/90 transition-colors">
            <Navigation className="w-4 h-4" /> Get Directions
          </a>
        </div>
      </div>
    </section>
  );
};

export default VenueMapSection;
