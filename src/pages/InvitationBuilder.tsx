import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { TEMPLATE_REGISTRY } from "@/templates";
import type { InvitationData } from "@/templates/types";
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

const defaultFormData = (ceremonyLabel: string): InvitationData => ({
  bride_name: "",
  groom_name: "",
  bride_family: "",
  groom_family: "",
  personal_message: "",
  wedding_date: "",
  photo_url: undefined,
  language: "english",
  events: [
    { event_type: "mehndi", event_name: "Mehndi", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
    { event_type: "haldi", event_name: "Haldi", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
    { event_type: "sangeet", event_name: "Sangeet", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
    { event_type: "baraat", event_name: "Baraat", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
    { event_type: "ceremony", event_name: ceremonyLabel, is_enabled: true, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
    { event_type: "reception", event_name: "Reception", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
  ],
  upi_id: "",
  gift_registry_url: "",
});

const getCeremonyLabel = (community: string): string => {
  switch (community) {
    case "Muslim": return "Nikah";
    case "Sikh": return "Anand Karaj";
    case "South Indian": return "Kalyanam";
    default: return "Vivah";
  }
};

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
        // Find ceremony event date for wedding_date fallback
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
          personal_message: existing.personal_message || "",
          wedding_date: existing.wedding_date || ceremonyEvt?.event_date || "",
          photo_url: existing.photo_url || undefined,
          language: existing.language || "english",
          upi_id: existing.upi_id || "",
          gift_registry_url: existing.gift_registry_url || "",
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
              event_type: e.event_type as "mehndi" | "haldi" | "sangeet" | "baraat" | "ceremony" | "reception",
              event_name: e.event_name,
              is_enabled: e.is_enabled,
            }))
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
        personal_message: formData.personal_message || null,
        wedding_date: formData.wedding_date || null,
        photo_url: formData.photo_url || null,
        language: formData.language,
        upi_id: formData.upi_id || null,
        gift_registry_url: formData.gift_registry_url || null,
      })
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

  // Save on blur handler
  const handleBlur = useCallback(() => {
    saveToSupabase();
  }, [saveToSupabase]);

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
    const slug = `${formData.bride_name.toLowerCase()}-${formData.groom_name.toLowerCase()}-${Date.now().toString(36)}`;
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
          TemplateComponent={TemplateComponent}
          onProceed={() => setStep(5)}
          onGoBack={() => setStep(3)}
        />
      );
      case 5: return <Step5Publish onSelectPlan={handlePublish} loading={publishLoading} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" onBlur={handleBlur}>
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
              <Check className="w-3 h-3 text-green-600" />
              Saved ✓
            </>
          )}
        </div>
      )}

      <StepIndicator currentStep={step} totalSteps={5} />

      <div className="flex-1 flex">
        {/* Form panel */}
        <div className={`${isMobile ? "w-full" : "w-2/5"} overflow-y-auto`}>
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

        {/* Live preview panel — desktop only */}
        {!isMobile && step <= 3 && (
          <div className="w-3/5 border-l border-border bg-muted/30 overflow-y-auto">
            <div className="p-6 flex justify-center">
              <div className="w-[375px] shadow-2xl border border-border">
                <TemplateComponent data={formData} isPreview={false} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile floating preview button */}
      {isMobile && step <= 3 && (
        <button
          onClick={() => setShowMobilePreview(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground shadow-lg px-5 py-3 flex items-center gap-2 font-body text-sm z-50"
        >
          <Eye className="w-4 h-4" /> Preview
        </button>
      )}

      {/* Mobile preview modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-display text-lg text-primary">Live Preview</h3>
            <button onClick={() => setShowMobilePreview(false)}>
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <div className="overflow-y-auto" style={{ height: "calc(100vh - 60px)" }}>
            <TemplateComponent data={formData} isPreview={false} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationBuilder;
