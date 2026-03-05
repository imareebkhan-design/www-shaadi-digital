import { BuilderFormData } from "@/types/builder";
import { TemplateData } from "@/data/templates";
import { format } from "date-fns";

interface Props {
  data: BuilderFormData;
  template: TemplateData;
}

const LivePreview = ({ data, template }: Props) => {
  const brideName = data.bride_name || "Bride";
  const groomName = data.groom_name || "Groom";
  const enabledEvents = data.events.filter((e) => e.is_enabled);

  return (
    <div className={`min-h-[600px] bg-gradient-to-br ${template.gradient} text-white`}>
      {/* Hero */}
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center relative">
        <span className="text-4xl text-white/15 mb-4">{template.motif}</span>
        <p className="font-serif italic text-white/50 text-xs tracking-widest uppercase mb-6">
          Together with their families
        </p>

        {data.bride_family && (
          <p className="font-body text-white/60 text-xs mb-1">{data.bride_family}</p>
        )}
        <h2 className="font-display text-4xl font-bold mb-1">{brideName}</h2>
        <p className="font-serif italic text-secondary text-2xl my-3">&</p>
        <h2 className="font-display text-4xl font-bold mb-1">{groomName}</h2>
        {data.groom_family && (
          <p className="font-body text-white/60 text-xs mt-1">{data.groom_family}</p>
        )}

        <div className="w-12 h-px bg-secondary/60 my-6" />

        {data.personal_message && (
          <p className="font-serif italic text-white/70 text-sm max-w-xs">{data.personal_message}</p>
        )}
      </div>

      {/* Photo */}
      {data.photo_url && (
        <div className="flex justify-center px-6 pb-8">
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white/20">
            <img src={data.photo_url} alt="Couple" className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Events */}
      {enabledEvents.length > 0 && (
        <div className="px-6 pb-12 space-y-6">
          {enabledEvents.map((event) => (
            <div key={event.event_type} className="text-center border-t border-white/10 pt-6">
              <h3 className="font-display text-xl font-semibold mb-2">{event.event_name}</h3>
              <div className="font-body text-sm text-white/70 space-y-1">
                {event.event_date && (
                  <p>{format(new Date(event.event_date + "T00:00:00"), "EEEE, d MMMM yyyy")}</p>
                )}
                {event.event_time && <p>{event.event_time}</p>}
                {event.venue_name && <p className="font-medium text-white/90">{event.venue_name}</p>}
                {event.venue_address && <p className="text-xs text-white/50">{event.venue_address}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-8 border-t border-white/10">
        <span className="text-2xl text-white/15">{template.motif}</span>
        <p className="font-body text-xs text-white/40 mt-2">Made with Shaadi.Digital</p>
      </div>
    </div>
  );
};

export default LivePreview;
