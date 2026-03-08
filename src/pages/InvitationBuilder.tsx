import { useState, useEffect, useCallback, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TEMPLATE_REGISTRY } from "@/templates";
import type { InvitationData } from "@/templates/types";
import { invitationDataToConfig } from "@/templates/types";
import { WeddingTemplate } from "@/templates/WeddingTemplate";
import StepIndicator from "@/components/builder/StepIndicator";
import Step1CoupleNames from "@/components/builder/Step1CoupleNames";
import Step2Events from "@/components/builder/Step2Events";
import Step3PhotoLanguage from "@/components/builder/Step3PhotoLanguage";
import Step4Preview from "@/components/builder/Step4Preview";
import Step5Publish from "@/components/builder/Step5Publish";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, ArrowRight, X, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { defaultEvents, DEFAULT_TAGLINES } from "@/types/builder";

const getCeremonyLabel = (community: string): string => {
  switch (community) {
    case "Muslim": return "Nikah";
    case "Sikh": return "Anand Karaj";
    case "South Indian": return "Kalyanam";
    default: return "Vivah";
  }
};

const defaultFormData = (ceremonyLabel: string): InvitationData => ({
  bride_name: "",
  groom_name: "",
  bride_family: "",
  groom_family: "",
  bride_full_name: "",
  groom_full_name: "",
  bride_bio: "",
  groom_bio: "",
  personal_message: "",
  our_story: "",
  wedding_date: "",
  wedding_city: "",
  photo_url: undefined,
  gallery_photos: [],
  language: "english",
  events: defaultEvents(ceremonyLabel),
  upi_id: "",
  gift_registry_url: "",
  dresscode_enabled: false,
  dresscode_text: "",
  dresscode_colors: [],
  music_url: "",
  venue_description: "",
  venue_photo: "",
  rsvp_deadline: "",
  hero_media_type: "photo",
  hero_media_url: "",
});

const InvitationBuilder = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  const template = templateId ? TEMPLATE_REGISTRY[templateId] : null;
  const TemplateComponent = template?.component;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState<InvitationData>(
    defaultFormData(getCeremonyLabel(template?.community || ""))
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem("selectedTemplateId", templateId || "");
      navigate("/login");
    }
  }, [authLoading, user, navigate, templateId]);

  // Redirect if invalid template
  useEffect(() => {
    if (!authLoading && !template) navigate("/templates");
  }, [template, navigate, authLoading]);

  // Create or load invitation
  useEffect(() => {
    if (!user || !templateId) return;

    const loadOrCreate = async () => {
      const { data: existing } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .eq("template_id", templateId)
        .eq("status", "draft")
        .maybeSingle();

      if (existing) {
        setInvitationId(existing.id);
        const { data: events } = await supabase
          .from("events")
          .select("*")
          .eq("invitation_id", existing.id);

        const ceremonyEvt = events?.find((e) => e.event_type === "ceremony");

        setFormData((prev) => ({
          ...prev,
          bride_name: existing.bride_name || "",
          groom_name: existing.groom_name || "",
          bride_family: existing.bride_family || "",
          groom_family: existing.groom_family || "",
          bride_full_name: (existing as any).bride_full_name || "",
          groom_full_name: (existing as any).groom_full_name || "",
          bride_bio: (existing as any).bride_bio || "",
          groom_bio: (existing as any).groom_bio || "",
          personal_message: existing.personal_message || "",
          our_story: existing.our_story || "",
          wedding_date: existing.wedding_date || ceremonyEvt?.event_date || "",
          wedding_city: (existing as any).wedding_city || "",
          photo_url: existing.photo_url || undefined,
          gallery_photos: (existing.gallery_photos as string[]) || [],
          language: existing.language || "english",
          upi_id: existing.upi_id || "",
          gift_registry_url: existing.gift_registry_url || "",
          dresscode_enabled: existing.dresscode_enabled || false,
          dresscode_text: existing.dresscode_text || "",
          dresscode_colors: (existing.dresscode_colors as string[]) || [],
          music_url: existing.music_url || "",
          venue_description: (existing as any).venue_description || "",
          venue_photo: (existing as any).venue_photo || "",
          rsvp_deadline: (existing as any).rsvp_deadline || "",
          hero_media_type: (existing as any).hero_media_type || "photo",
          hero_media_url: (existing as any).hero_media_url || "",
          events: prev.events.map((defaultEvt) => {
            const saved = events?.find((e) => e.event_type === defaultEvt.event_type);
            if (saved) {
              return {
                ...defaultEvt,
                is_enabled: saved.is_enabled,
                event_date: saved.event_date || "",
                event_time: saved.event_time || "",
                venue_name: saved.venue_name || "",
                venue_address: saved.venue_address || "",
                maps_url: saved.maps_url || "",
                tagline: (saved as any).tagline || DEFAULT_TAGLINES[saved.event_type] || "",
                description: (saved as any).description || "",
                event_photo: (saved as any).event_photo || "",
              };
            }
            return defaultEvt;
          }),
        }));
      } else {
        const { data: newInv } = await supabase
          .from("invitations")
          .insert({ user_id: user.id, template_id: templateId })
          .select()
          .single();

        if (newInv) {
          setInvitationId(newInv.id);
          await supabase.from("events").insert(
            formData.events.map((e) => ({
              invitation_id: newInv.id,
              event_type: e.event_type as any,
              event_name: e.event_name,
              is_enabled: e.is_enabled,
              tagline: e.tagline || null,
            } as any))
          );
        }
      }
    };

    loadOrCreate();
  }, [user, templateId]);

  // Save to Supabase
  const saveToSupabase = useCallback(async () => {
    if (!invitationId || !user) return;
    setSaveStatus("saving");

    await supabase
      .from("invitations")
      .update({
        bride_name: formData.bride_name || null,
        groom_name: formData.groom_name || null,
        bride_family: formData.bride_family || null,
        groom_family: formData.groom_family || null,
        bride_full_name: formData.bride_full_name || null,
        groom_full_name: formData.groom_full_name || null,
        bride_bio: formData.bride_bio || null,
        groom_bio: formData.groom_bio || null,
        personal_message: formData.personal_message || null,
        our_story: formData.our_story || null,
        wedding_date: formData.wedding_date || null,
        wedding_city: formData.wedding_city || null,
        photo_url: formData.photo_url || null,
        gallery_photos: formData.gallery_photos || [],
        language: formData.language,
        upi_id: formData.upi_id || null,
        gift_registry_url: formData.gift_registry_url || null,
        dresscode_enabled: formData.dresscode_enabled || false,
        dresscode_text: formData.dresscode_text || null,
        dresscode_colors: formData.dresscode_colors || [],
        music_url: formData.music_url || null,
        venue_description: formData.venue_description || null,
        venue_photo: formData.venue_photo || null,
        rsvp_deadline: formData.rsvp_deadline || null,
        hero_media_type: formData.hero_media_type || "photo",
        hero_media_url: formData.hero_media_url || null,
      } as any)
      .eq("id", invitationId);

    for (const event of formData.events) {
      await supabase
        .from("events")
        .update({
          event_name: event.event_name,
          is_enabled: event.is_enabled,
          event_date: event.event_date || null,
          event_time: event.event_time || null,
          venue_name: event.venue_name || null,
          venue_address: event.venue_address || null,
          maps_url: event.maps_url || null,
          tagline: event.tagline || null,
          description: event.description || null,
          event_photo: event.event_photo || null,
        } as any)
        .eq("invitation_id", invitationId)
        .eq("event_type", event.event_type as any);
    }

    setSaveStatus("saved");
    if (savedTimeout.current) clearTimeout(savedTimeout.current);
    savedTimeout.current = setTimeout(() => setSaveStatus("idle"), 3000);
  }, [invitationId, user, formData]);

  // Auto-save every 30 seconds
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => saveToSupabase(), 30000);
    return () => { if (autoSaveTimer.current) clearInterval(autoSaveTimer.current); };
  }, [saveToSupabase]);

  const handleBlur = useCallback(() => { saveToSupabase(); }, [saveToSupabase]);

  const updateFormData = (updates: Partial<InvitationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.bride_name.trim()) newErrors.bride_name = "Bride's name is required";
      if (!formData.groom_name.trim()) newErrors.groom_name = "Groom's name is required";
      if (!formData.bride_family.trim()) newErrors.bride_family = "Bride's family is required";
      if (!formData.groom_family.trim()) newErrors.groom_family = "Groom's family is required";
    }
    if (s === 2) {
      const ceremonyEvent = formData.events.find((e) => e.event_type === "ceremony");
      if (!ceremonyEvent?.is_enabled) newErrors.events = "Main Ceremony must be enabled";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;
    await saveToSupabase();
    setStep((s) => Math.min(s + 1, 5));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handlePublish = async (plan: "basic" | "premium" | "elite") => {
    if (!invitationId || !user) return;
    setPublishLoading(true);
    await saveToSupabase();

    const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
    let slug = `${slugify(formData.bride_name)}-and-${slugify(formData.groom_name)}`;

    const { data: existing } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error } = await supabase
      .from("invitations")
      .update({ status: "published", plan, slug })
      .eq("id", invitationId);
    setPublishLoading(false);
    if (error) { toast("Failed to publish. Please try again."); return; }
    toast("🎉 Your invitation is live!");
    navigate("/dashboard");
  };

  if (!template || !TemplateComponent || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1CoupleNames data={formData as any} onChange={updateFormData as any} errors={errors} />;
      case 2: return <Step2Events data={formData as any} onChange={updateFormData as any} errors={errors} />;
      case 3: return <Step3PhotoLanguage data={formData as any} onChange={updateFormData as any} errors={errors} />;
      case 4: return (
        <Step4Preview
          data={formData}
          templateId={templateId!}
          onProceed={() => setStep(5)}
          onGoBack={() => setStep(3)}
        />
      );
      case 5: return <Step5Publish onSelectPlan={handlePublish} loading={publishLoading} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background" onBlur={handleBlur}>
      <SEOHead
        title="Build Your Invitation — Shaadi.Digital"
        description="Customise your digital wedding invitation with couple names, events, photos, and more."
        noIndex
      />
      {/* Save status indicator */}
      {saveStatus !== "idle" && (
        <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 shadow-sm font-body text-xs text-muted-foreground">
          {saveStatus === "saving" ? (
            <>
              <div className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full" />
              Saving…
            </>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              Saved ✓
            </>
          )}
        </div>
      )}

      {/* Mobile sticky bar */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-primary text-primary-foreground py-2 px-4 text-center font-display text-sm">
          {formData.groom_name || "Groom"} ♡ {formData.bride_name || "Bride"}
        </div>
      )}

      <div className="flex h-screen">
        {/* ─── LEFT: Form panel (40%) ─── */}
        <div className={`${isMobile ? "w-full" : "w-2/5"} h-screen overflow-y-auto border-r border-border`}>
          <StepIndicator currentStep={step} totalSteps={5} />

          <div className="p-6 md:p-8 max-w-xl mx-auto">
            {renderStep()}

            {step <= 3 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleBack} disabled={step === 1} className="rounded-none font-body gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-body gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: iPhone 16 Pro Max frame preview (60%) — desktop only ─── */}
        {!isMobile && (
          <div className="w-3/5 h-screen sticky top-0 flex items-center justify-center bg-muted/30">
        {/* iPhone 16 Pro Max: 430×932 logical, scaled to fit */}
            <div className="relative" style={{ width: 290, height: 620 }}>
              {/* Outer titanium frame */}
              <div
                className="absolute inset-0 rounded-[48px] pointer-events-none"
                style={{
                  background: "linear-gradient(145deg, #d4d0c8, #b8b4ac, #c8c4bc)",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
                }}
              />
              {/* Inner black bezel */}
              <div
                className="absolute rounded-[42px] pointer-events-none z-10"
                style={{
                  top: 6,
                  left: 6,
                  right: 6,
                  bottom: 6,
                  background: "#1a1a1a",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.6)",
                }}
              />

              {/* Side buttons — left (silent + volume) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: -3,
                  top: 100,
                  width: 4,
                  height: 18,
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(180deg, #c8c4bc, #a8a49c)",
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  left: -3,
                  top: 140,
                  width: 4,
                  height: 36,
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(180deg, #c8c4bc, #a8a49c)",
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  left: -3,
                  top: 186,
                  width: 4,
                  height: 36,
                  borderRadius: "3px 0 0 3px",
                  background: "linear-gradient(180deg, #c8c4bc, #a8a49c)",
                }}
              />
              {/* Side button — right (power) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  right: -3,
                  top: 155,
                  width: 4,
                  height: 50,
                  borderRadius: "0 3px 3px 0",
                  background: "linear-gradient(180deg, #c8c4bc, #a8a49c)",
                }}
              />

              {/* Dynamic Island */}
              <div
                className="absolute left-1/2 -translate-x-1/2 z-20 rounded-full flex items-center justify-center"
                style={{
                  top: 18,
                  width: 80,
                  height: 22,
                  background: "#000",
                }}
              >
                {/* Camera dot */}
                <div
                  className="rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: "radial-gradient(circle at 40% 40%, #2a2a3a, #111)",
                    marginLeft: 20,
                    boxShadow: "0 0 2px rgba(50,50,80,0.6)",
                  }}
                />
              </div>

              {/* Screen content area */}
              <div
                className="absolute overflow-hidden z-[5]"
                style={{
                  top: 12,
                  left: 12,
                  right: 12,
                  bottom: 12,
                  borderRadius: 36,
                }}
              >
                <div
                  className="overflow-y-auto"
                  style={{
                    width: 430,
                    height: 932,
                    transform: "scale(0.619)",
                    transformOrigin: "top left",
                  }}
                >
                  <WeddingTemplate config={invitationDataToConfig(formData)} templateId={templateId!} isPreview />
                </div>
              </div>

              {/* Home indicator */}
              <div
                className="absolute bottom-[18px] left-1/2 -translate-x-1/2 z-30 rounded-full"
                style={{
                  width: 84,
                  height: 4,
                  background: "rgba(255,255,255,0.45)",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Mobile: Floating preview button ─── */}
      {isMobile && step <= 3 && (
        <button
          onClick={() => setShowMobilePreview(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground shadow-lg px-5 py-3 flex items-center gap-2 font-body text-sm z-50 rounded-none"
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
      )}

      {/* ─── Mobile: Bottom sheet preview ─── */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-foreground/50" onClick={() => setShowMobilePreview(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            style={{ height: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <h3 className="font-display text-lg text-primary">Live Preview</h3>
              <button onClick={() => setShowMobilePreview(false)}>
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(85vh - 60px)" }}>
              <WeddingTemplate config={invitationDataToConfig(formData)} templateId={templateId!} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
              <Button onClick={() => setShowMobilePreview(false)} className="w-full bg-primary text-primary-foreground rounded-none h-12 font-body">
                Looks good — continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationBuilder;
