import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import type { InvitationEvent } from "../types";

interface Props {
  events: InvitationEvent[];
}

const ease = [0.25, 0.1, 0.25, 1] as const;

const VenueMapSection = ({ events }: Props) => {
  const mainEvent = events.find((e) => e.is_enabled && e.event_type === "ceremony") || events.find((e) => e.is_enabled);
  if (!mainEvent || (!mainEvent.venue_name && !mainEvent.venue_address)) return null;

  const query = [mainEvent.venue_name, mainEvent.venue_address].filter(Boolean).join(", ");
  const mapsUrl = mainEvent.maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <section className="py-24 md:py-36 bg-background relative overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
          className="text-center mb-16"
        >
          <span className="invite-section-label mb-6 block">Where it all happens</span>
          <h2 className="invite-section-title">The Venue</h2>
        </motion.div>

        {/* Venue card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.4, ease }}
          className="relative rounded-3xl overflow-hidden shadow-elegant bg-card gold-border p-8 md:p-14 text-center mb-8"
        >
          <h3 className="font-display text-foreground text-3xl md:text-5xl mb-3">
            {mainEvent.venue_name}
          </h3>
          {mainEvent.venue_address && (
            <p className="font-elegant text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
              {mainEvent.venue_address}
            </p>
          )}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase bg-gold/20 backdrop-blur-sm text-gold-dark border border-gold/30 px-5 py-2.5 rounded-full hover:bg-gold/30 transition-all duration-300"
          >
            <Navigation className="w-3.5 h-3.5" />
            Get Directions
          </a>
        </motion.div>

        {/* Map embed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          className="rounded-2xl overflow-hidden shadow-card-wedding gold-border aspect-[21/9] bg-muted"
        >
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Venue location map"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default VenueMapSection;
