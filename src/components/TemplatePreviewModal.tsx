import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TEMPLATE_REGISTRY, DEMO_DATA } from "@/templates";
import type { InvitationData } from "@/templates/types";
import { WeddingTemplate } from "@/templates/WeddingTemplate";

const STORAGE_KEY = "shaadi_template_preview";
const FAVOURITES_KEY = "shaadi_template_favourites";

interface SavedState {
  templateId: string;
  name1: string;
  name2: string;
  date: string;
}

interface TemplatePreviewModalProps {
  templateId: string;
  onClose: () => void;
}

const TemplatePreviewModal = ({ templateId, onClose }: TemplatePreviewModalProps) => {
  const navigate = useNavigate();
  const template = TEMPLATE_REGISTRY[templateId];

  // Load persisted state
  const saved: SavedState | null = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.templateId === templateId) return parsed;
      }
    } catch {}
    return null;
  }, [templateId]);

  const [name1, setName1] = useState(saved?.name1 || "");
  const [name2, setName2] = useState(saved?.name2 || "");
  const [date, setDate] = useState<Date | undefined>(saved?.date ? new Date(saved.date) : undefined);
  const [isFavourited, setIsFavourited] = useState(false);
  const nameEnteredFired = useRef(false);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Analytics: template_preview_opened
  useEffect(() => {
    console.log("[analytics] template_preview_opened", { template_id: templateId });
  }, [templateId]);

  // Check if favourited
  useEffect(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
      setIsFavourited(favs.includes(templateId));
    } catch {}
  }, [templateId]);

  // Persist state (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const state: SavedState = { templateId, name1, name2, date: date?.toISOString() || "" };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, 150);
    return () => clearTimeout(timer);
  }, [templateId, name1, name2, date]);

  // Analytics: preview_name_entered (fire once)
  useEffect(() => {
    if (!nameEnteredFired.current && (name1.length > 0 || name2.length > 0)) {
      console.log("[analytics] preview_name_entered", { template_id: templateId });
      nameEnteredFired.current = true;
    }
  }, [name1, name2, templateId]);

  // Build preview data
  const previewData: InvitationData = useMemo(() => ({
    ...DEMO_DATA,
    bride_name: name1 || "Priya",
    groom_name: name2 || "Rohan",
    wedding_date: date ? format(date, "yyyy-MM-dd") : "2026-02-25",
  }), [name1, name2, date]);

  const handleCTA = useCallback(() => {
    console.log("[analytics] preview_cta_clicked", {
      template_id: templateId,
      name1_filled: name1.length > 0,
      name2_filled: name2.length > 0,
    });
    const params = new URLSearchParams();
    params.set("template", templateId);
    if (name1) params.set("name1", name1);
    if (name2) params.set("name2", name2);
    navigate(`/signup?${params.toString()}`);
  }, [templateId, name1, name2, navigate]);

  const toggleFavourite = useCallback(() => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
      const next = isFavourited ? favs.filter((f) => f !== templateId) : [...favs, templateId];
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next));
      setIsFavourited(!isFavourited);
    } catch {}
  }, [isFavourited, templateId]);

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch bg-black/80" onClick={onClose}>
      <div
        className="relative flex flex-col md:flex-row w-full h-full bg-background overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[110] w-10 h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 flex items-center justify-center transition-colors"
          aria-label="Close preview"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* LEFT PANEL — Edit Strip */}
        <div className="w-full md:w-[40%] flex flex-col p-6 md:p-8 overflow-y-auto shrink-0 border-b md:border-b-0 md:border-r border-border">
          <div className="flex-1">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground">
              See your names on this template ✦
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5 font-body">
              No account needed — just type below
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground font-body">Your Name</label>
                <Input
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder="e.g. Priya"
                  className="mt-1.5 text-base min-h-[48px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground font-body">Partner's Name</label>
                <Input
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder="e.g. Rohan"
                  className="mt-1.5 text-base min-h-[48px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground font-body">Wedding Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1.5 justify-start text-left font-normal min-h-[48px] text-base",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "dd MMM yyyy") : "Your wedding date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[120]" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Template info */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="font-display text-base font-semibold text-foreground">{template.name}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                {template.community} · {template.tone}
              </p>
            </div>
          </div>

          {/* Sticky CTA */}
          <div className="mt-6 pt-4 border-t border-border md:sticky md:bottom-0 bg-background">
            <Button
              onClick={handleCTA}
              className="w-full min-h-[52px] text-sm font-medium tracking-wide rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
            >
              💛 Save & Share This Invite
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2 font-body">
              Free to preview · Pay only when you publish
            </p>
          </div>
        </div>

        {/* RIGHT PANEL — Live Preview */}
        <div className="flex-1 relative overflow-y-auto bg-[hsl(var(--muted))]">
          {/* Shortlist button */}
          <button
            onClick={toggleFavourite}
            className="absolute top-3 left-3 z-[105] flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium backdrop-blur-md transition-colors"
            style={{
              background: isFavourited ? "hsl(var(--primary))" : "rgba(255,255,255,0.15)",
              color: isFavourited ? "hsl(var(--primary-foreground))" : "white",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Heart className={cn("w-3.5 h-3.5", isFavourited && "fill-current")} />
            {isFavourited ? "Shortlisted" : "Shortlist ♡"}
          </button>

          {/* Template render */}
          <div className="min-h-full">
            <WeddingTemplate
              config={{
                couple: {
                  brideName: previewData.bride_name,
                  groomName: previewData.groom_name,
                  brideFamily: previewData.bride_family,
                  groomFamily: previewData.groom_family,
                  story: previewData.our_story,
                },
                weddingDate: previewData.wedding_date,
                personalMessage: previewData.personal_message,
                language: previewData.language,
                events: previewData.events.map((e) => ({
                  type: e.event_type,
                  name: e.event_name,
                  date: e.event_date,
                  time: e.event_time,
                  venueName: e.venue_name,
                  venueAddress: e.venue_address,
                  mapsUrl: e.maps_url,
                  enabled: e.is_enabled,
                })),
              }}
              templateId={templateId}
              isPreview
            />
          </div>

          {/* Bottom floating bar */}
          <div className="sticky bottom-0 left-0 right-0 py-3 px-4 text-center text-xs font-body text-muted-foreground backdrop-blur-md" style={{ background: "rgba(255,255,255,0.85)" }}>
            ✨ This is exactly what your guests will see
          </div>
        </div>

        {/* Mobile fixed CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[110] p-3 border-t border-border bg-background">
          <Button
            onClick={handleCTA}
            className="w-full min-h-[52px] text-sm font-medium tracking-wide rounded-none bg-primary text-primary-foreground hover:bg-primary/90"
          >
            💛 Save & Share This Invite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
