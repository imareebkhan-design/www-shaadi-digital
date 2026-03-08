import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Link as LinkIcon, Tag, FileText, Camera, Upload } from "lucide-react";
import { BuilderFormData, EventData, DEFAULT_TAGLINES } from "@/types/builder";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

interface Props {
  data: BuilderFormData;
  onChange: (data: Partial<BuilderFormData>) => void;
  errors: Record<string, string>;
}

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  mehndi: "An intimate afternoon of intricate henna artistry, music, and celebration with close family and friends.",
  haldi: "A joyful morning ceremony filled with turmeric, blessings, and laughter shared with loved ones.",
  sangeet: "An enchanting evening of music, dance performances, and joyous celebrations under the stars.",
  baraat: "A grand and festive procession as the groom arrives with family and friends in high spirits.",
  ceremony: "The sacred union of two souls, bound by love, blessings, and the warmth of family.",
  reception: "An elegant evening of celebration, good food, and cherished moments with all who joined us on this journey.",
};

const Step2Events = ({ data, onChange, errors }: Props) => {
  const { user } = useAuth();
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const updateEvent = (index: number, updates: Partial<EventData>) => {
    const newEvents = [...data.events];
    newEvents[index] = { ...newEvents[index], ...updates };
    onChange({ events: newEvents });
  };

  const handleToggle = (index: number, checked: boolean, event: EventData) => {
    if (event.event_type === "ceremony" && !checked) return;
    const updates: Partial<EventData> = { is_enabled: checked };
    if (checked && !event.description) {
      updates.description = DEFAULT_DESCRIPTIONS[event.event_type] || "";
    }
    updateEvent(index, updates);
  };

  const handlePhotoUpload = async (index: number, file: File, eventType: string) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) { toast.error("Only JPG, PNG, WEBP"); return; }
    setUploading(eventType);
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/event-${eventType}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("couple-photos").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(null); return; }
    const { data: urlData } = supabase.storage.from("couple-photos").getPublicUrl(path);
    updateEvent(index, { event_photo: urlData.publicUrl });
    setUploading(null);
    toast.success("Photo uploaded!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-primary mb-1">Wedding Events</h2>
        <p className="font-body text-sm text-muted-foreground">Toggle on the events you want to include</p>
      </div>

      {errors.events && <p className="text-xs text-destructive bg-destructive/10 p-3 rounded">{errors.events}</p>}

      <div className="space-y-4">
        {data.events.map((event, index) => (
          <div key={event.event_type} className="border border-border bg-card overflow-hidden">
            {/* Toggle header */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={event.is_enabled}
                  onCheckedChange={(checked) => handleToggle(index, checked, event)}
                />
                <span className="font-display text-base font-semibold text-foreground">
                  {event.event_name}
                </span>
                {event.event_type === "ceremony" && (
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 font-body">Required</span>
                )}
              </div>
            </div>

            {/* Expanded fields */}
            {event.is_enabled && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Tag className="w-3 h-3" /> Tagline
                    </label>
                    <Input
                      placeholder={DEFAULT_TAGLINES[event.event_type] || "e.g. A beautiful celebration"}
                      value={event.tagline || ""}
                      onChange={(e) => updateEvent(index, { tagline: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                      <FileText className="w-3 h-3" /> Short Description
                    </label>
                    <Input
                      placeholder="e.g. An intimate afternoon of art and celebration"
                      value={event.description || ""}
                      onChange={(e) => updateEvent(index, { description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Event Photo Selector */}
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-2 block">Event Photo</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateEvent(index, { event_photo: "" })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-body border transition-all ${
                        !event.event_photo
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" /> 📷 Use our photo
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
                      <Upload className="w-3.5 h-3.5" /> ⬆️ Upload yours
                    </button>
                    <input
                      ref={(el) => { fileRefs.current[event.event_type] = el; }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handlePhotoUpload(index, f, event.event_type);
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
                      onChange={(e) => updateEvent(index, { event_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3" /> Time
                    </label>
                    <Input
                      type="time"
                      value={event.event_time}
                      onChange={(e) => updateEvent(index, { event_time: e.target.value })}
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
                    onChange={(e) => updateEvent(index, { venue_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground mb-1 block">Venue Address</label>
                  <Input
                    placeholder="Full address"
                    value={event.venue_address}
                    onChange={(e) => updateEvent(index, { venue_address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-body text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <LinkIcon className="w-3 h-3" /> Google Maps URL <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    placeholder="Paste a Google Maps share link"
                    value={event.maps_url}
                    onChange={(e) => updateEvent(index, { maps_url: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2Events;
