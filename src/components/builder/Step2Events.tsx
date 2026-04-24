import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Link as LinkIcon, Tag, FileText, Camera, Upload, CalendarDays } from "lucide-react";
import { BuilderFormData, EventData, DEFAULT_TAGLINES, VISIBLE_EVENTS_BY_TYPE } from "@/types/builder";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  data: BuilderFormData;
  onChange: (data: Partial<BuilderFormData>) => void;
  errors: Record<string, string>;
  weddingType?: string;
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  mehndi: "An intimate afternoon of intricate henna artistry, music, and celebration with close family and friends.",
  haldi: "A joyful morning ceremony filled with turmeric, blessings, and laughter shared with loved ones.",
  sangeet: "An enchanting evening of music, dance performances, and joyous celebrations under the stars.",
  baraat: "A grand and festive procession as the groom arrives with family and friends in high spirits.",
  ceremony: "The sacred union of two souls, bound by love, blessings, and the warmth of family.",
  reception: "An elegant evening of celebration, good food, and cherished moments with all who joined us on this journey.",
};

const eventEmojis: Record<string, string> = {
  mehndi: "🌿",
  haldi: "🌼",
  sangeet: "🎶",
  baraat: "🐴",
  ceremony: "🕉️",
  reception: "🥂",
};

const Step2Events = ({ data, onChange, errors, weddingType = "hindu" }: Props) => {
  const { user } = useAuth();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  // Only show events relevant to this wedding type
  const visibleTypes = VISIBLE_EVENTS_BY_TYPE[weddingType] ?? VISIBLE_EVENTS_BY_TYPE.hindu;
  const visibleEvents = data.events.filter((e) => visibleTypes.includes(e.event_type));

  // Map back to the full events array index for updates
  const updateEvent = (eventType: string, updates: Partial<EventData>) => {
    const newEvents = data.events.map((e) =>
      e.event_type === eventType ? { ...e, ...updates } : e
    );
    onChange({ events: newEvents });
  };

  const handleToggle = (event: EventData, checked: boolean) => {
    if (event.event_type === "ceremony" && !checked) return;
    const updates: Partial<EventData> = { is_enabled: checked };
    if (checked && !event.description) {
      updates.description = DEFAULT_DESCRIPTIONS[event.event_type] || "";
    }
    updateEvent(event.event_type, updates);
  };

  const handlePhotoUpload = async (file: File, eventType: string) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast.error("Only JPG, PNG, WEBP"); return; }
    setUploading(eventType);
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/event-${eventType}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("couple-photos").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(null); return; }
    const { data: urlData } = supabase.storage.from("couple-photos").getPublicUrl(path);
    updateEvent(eventType, { event_photo: urlData.publicUrl });
    setUploading(null);
    toast.success("Photo uploaded!");
  };

  const enabledCount = visibleEvents.filter(e => e.is_enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-3">
          <CalendarDays className="w-4.5 h-4.5 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl text-primary mb-1">Wedding Events</h2>
        <p className="font-body text-sm text-muted-foreground">
          Toggle on the events you want to include
          <span className="ml-2 text-secondary font-medium">({enabledCount} selected)</span>
        </p>
      </div>

      {errors.events && (
        <div className="text-xs text-destructive bg-destructive/10 p-3 border border-destructive/20 flex items-center gap-2">
          <span>⚠️</span> {errors.events}
        </div>
      )}

      <div className="space-y-3">
        {visibleEvents.map((event) => (
          <div
            key={event.event_type}
            className={`border overflow-hidden transition-all duration-200 ${
              event.is_enabled
                ? "border-primary/20 bg-card shadow-sm"
                : "border-border bg-card/50"
            }`}
          >
            {/* Toggle header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={event.is_enabled}
                  onCheckedChange={(checked) => handleToggle(event, checked)}
                />
                <span className="text-lg mr-1">{eventEmojis[event.event_type] || "📌"}</span>
                <div>
                  <span className="font-display text-base font-semibold text-foreground">
                    {event.event_name}
                  </span>
                  {event.event_type === "ceremony" && (
                    <span className="ml-2 text-[10px] bg-secondary/20 text-secondary px-2 py-0.5 font-body font-medium">Required</span>
                  )}
                </div>
              </div>
              {event.is_enabled && (
                <span className="text-[10px] text-muted-foreground font-body">
                  {event.event_date ? "✓ Date set" : "Add details →"}
                </span>
              )}
            </div>

            {/* Expanded fields */}
            <AnimatePresence>
              {event.is_enabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 space-y-4 border-t border-border/50 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <Tag className="w-3 h-3" /> Tagline
                        </label>
                        <Input
                          placeholder={DEFAULT_TAGLINES[event.event_type] || "e.g. A beautiful celebration"}
                          value={event.tagline || ""}
                          onChange={(e) => updateEvent(event.event_type, { tagline: e.target.value })}
                          className="border-border/60"
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <FileText className="w-3 h-3" /> Short Description
                        </label>
                        <Input
                          placeholder="e.g. An intimate afternoon of art and celebration"
                          value={event.description || ""}
                          onChange={(e) => updateEvent(event.event_type, { description: e.target.value })}
                          className="border-border/60"
                        />
                      </div>
                    </div>

                    {/* Event Photo Selector */}
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-2 block">Event Photo</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateEvent(event.event_type, { event_photo: "" })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border transition-all ${
                            !event.event_photo
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <Camera className="w-3.5 h-3.5" /> Use template photo
                        </button>
                        <button
                          type="button"
                          onClick={() => fileRefs.current[event.event_type]?.click()}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border transition-all ${
                            event.event_photo
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload yours
                        </button>
                        <input
                          ref={(el) => { fileRefs.current[event.event_type] = el; }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handlePhotoUpload(f, event.event_type);
                          }}
                        />
                      </div>
                      {uploading === event.event_type && (
                        <p className="text-xs text-secondary mt-1 animate-pulse">Uploading…</p>
                      )}
                      {event.event_photo && (
                        <div className="mt-2">
                          <img
                            src={event.event_photo}
                            alt={`${event.event_name} photo`}
                            className="w-20 h-14 object-cover border border-border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3 h-3" /> Date
                        </label>
                        <Input
                          type="date"
                          value={event.event_date}
                          onChange={(e) => updateEvent(event.event_type, { event_date: e.target.value })}
                          className="border-border/60"
                        />
                      </div>
                      <div>
                        <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                          <Clock className="w-3 h-3" /> Time
                        </label>
                        <Input
                          type="time"
                          value={event.event_time}
                          onChange={(e) => updateEvent(event.event_type, { event_time: e.target.value })}
                          className="border-border/60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3 h-3" /> Venue Name
                      </label>
                      <Input
                        placeholder="e.g. The Grand Ballroom"
                        value={event.venue_name}
                        onChange={(e) => updateEvent(event.event_type, { venue_name: e.target.value })}
                        className="border-border/60"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground mb-1 block">Venue Address</label>
                      <Input
                        placeholder="Full address"
                        value={event.venue_address}
                        onChange={(e) => updateEvent(event.event_type, { venue_address: e.target.value })}
                        className="border-border/60"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                        <LinkIcon className="w-3 h-3" /> Google Maps URL <span className="text-muted-foreground">(optional)</span>
                      </label>
                      <Input
                        placeholder="Paste a Google Maps share link"
                        value={event.maps_url}
                        onChange={(e) => updateEvent(event.event_type, { maps_url: e.target.value })}
                        className="border-border/60"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2Events;
