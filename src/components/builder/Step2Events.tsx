import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Link as LinkIcon, Tag, FileText } from "lucide-react";
import { BuilderFormData, EventData, DEFAULT_TAGLINES } from "@/types/builder";

interface Props {
  data: BuilderFormData;
  onChange: (data: Partial<BuilderFormData>) => void;
  errors: Record<string, string>;
}

const Step2Events = ({ data, onChange, errors }: Props) => {
  const updateEvent = (index: number, updates: Partial<EventData>) => {
    const newEvents = [...data.events];
    newEvents[index] = { ...newEvents[index], ...updates };
    onChange({ events: newEvents });
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
                  onCheckedChange={(checked) => {
                    if (event.event_type === "ceremony" && !checked) return;
                    updateEvent(index, { is_enabled: checked });
                  }}
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
