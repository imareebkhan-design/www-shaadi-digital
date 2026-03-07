import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { InvitationEvent } from "../types";

const ease = [0.25, 0.1, 0.25, 1] as const;

const getDirectionsUrl = (event: InvitationEvent) => {
  if (event.maps_url) return event.maps_url;
  const query = [event.venue_name, event.venue_address].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

interface Props {
  events: InvitationEvent[];
  gradient: string;
}

const ScheduleSection = ({ events }: Props) => {
  const enabled = events.filter((e) => e.is_enabled);
  if (enabled.length === 0) return null;

  return (
    <section className="py-24 md:py-36 bg-gradient-royal relative overflow-hidden">
      {/* Animated grid bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--gold-light)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold-light)) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="container max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
          className="text-center mb-20"
        >
          <span className="inline-block font-body text-[10px] tracking-[0.5em] uppercase text-gold-light/40 mb-6">
            Days of celebration
          </span>
          <h2 className="font-display text-primary-foreground text-4xl md:text-6xl lg:text-7xl">
            The Festivities
          </h2>
        </motion.div>

        <div className="space-y-20 md:space-y-28">
          {enabled.map((event, i) => (
            <motion.div
              key={event.event_type}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.4, ease }}
              className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-10 md:gap-16 items-center`}
            >
              {/* Event image or emoji */}
              <div className="w-full md:w-1/2 relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-primary-foreground/5 backdrop-blur-sm border border-gold/10">
                  {event.event_photo ? (
                    <img src={event.event_photo} alt={event.event_name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl md:text-8xl">
                        {event.event_type === "mehndi" ? "🌿" :
                         event.event_type === "haldi" ? "💛" :
                         event.event_type === "sangeet" ? "🎶" :
                         event.event_type === "baraat" ? "🐴" :
                         event.event_type === "ceremony" ? "🪔" :
                         event.event_type === "reception" ? "🎉" : "🎊"}
                      </span>
                    </div>
                  )}
                </div>
                {/* Floating event number */}
                <div className="absolute -top-4 -left-4 md:-left-6 w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="font-display text-lg md:text-xl text-secondary-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="w-full md:w-1/2">
                <span className="font-body text-[10px] tracking-[0.4em] uppercase text-gold/50 block mb-3">
                  {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                </span>
                <h3 className="font-display text-gold text-3xl md:text-5xl lg:text-6xl mb-2">
                  {event.event_name}
                </h3>
                {event.tagline && (
                  <p className="font-elegant text-gold-light/50 text-base md:text-lg italic mb-4">
                    {event.tagline}
                  </p>
                )}
                {event.description && (
                  <p className="font-body text-primary-foreground/50 text-sm leading-relaxed mb-5">
                    {event.description}
                  </p>
                )}

                <div className="space-y-4 p-6 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-gold/10">
                  {event.event_date && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <span className="font-body text-sm text-primary-foreground/70">
                        {new Date(event.event_date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                  )}
                  {event.event_time && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <span className="font-body text-sm text-primary-foreground/70">{event.event_time}</span>
                    </div>
                  )}
                  {event.venue_name && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <span className="font-body text-sm text-primary-foreground/70">{event.venue_name}</span>
                    </div>
                  )}
                </div>

                {(event.venue_name || event.venue_address || event.maps_url) && (
                  <a
                    href={getDirectionsUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 font-body text-[10px] tracking-[0.2em] uppercase bg-gold/20 backdrop-blur-sm text-gold-light border border-gold/30 px-5 py-2.5 rounded-full hover:bg-gold/30 transition-all duration-300"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Get Directions
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
