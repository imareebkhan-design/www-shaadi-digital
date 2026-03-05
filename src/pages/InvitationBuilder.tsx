import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getTemplateById, getCeremonyLabel } from "@/data/templates";
import { BuilderFormData, defaultEvents } from "@/types/builder";
import StepIndicator from "@/components/builder/StepIndicator";
import Step1CoupleNames from "@/components/builder/Step1CoupleNames";
import Step2Events from "@/components/builder/Step2Events";
import Step3PhotoLanguage from "@/components/builder/Step3PhotoLanguage";
import Step4Preview from "@/components/builder/Step4Preview";
import Step5Publish from "@/components/builder/Step5Publish";
import LivePreview from "@/components/builder/LivePreview";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, ArrowRight, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const InvitationBuilder = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();
  const template = getTemplateById(templateId || "");
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [formData, setFormData] = useState<BuilderFormData>({
    bride_name: "",
    groom_name: "",
    bride_family: "",
    groom_family: "",
    personal_message: "",
    events: defaultEvents(getCeremonyLabel(template?.community || "")),
    photo_url: null,
    language: "english",
    upi_id: "",
    gift_registry_url: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem("selectedTemplateId", templateId || "");
      navigate("/login");
    }
  }, [authLoading, user, navigate, templateId]);

  // Redirect if invalid template
  useEffect(() => {
    if (!template) navigate("/templates");
  }, [template, navigate]);

  // Create or load invitation
  useEffect(() => {
    if (!user || !templateId) return;

    const loadOrCreate = async () => {
      // Check for existing draft
      const { data: existing } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .eq("template_id", templateId)
        .eq("status", "draft")
        .maybeSingle();

      if (existing) {
        setInvitationId(existing.id);
        setFormData((prev) => ({
          ...prev,
          bride_name: existing.bride_name || "",
          groom_name: existing.groom_name || "",
          bride_family: existing.bride_family || "",
          groom_family: existing.groom_family || "",
          personal_message: existing.personal_message || "",
          photo_url: existing.photo_url,
          language: existing.language || "english",
          upi_id: existing.upi_id || "",
          gift_registry_url: existing.gift_registry_url || "",
        }));

        // Load events
        const { data: events } = await supabase
          .from("events")
          .select("*")
          .eq("invitation_id", existing.id);

        if (events && events.length > 0) {
          setFormData((prev) => ({
            ...prev,
            events: prev.events.map((defaultEvt) => {
              const saved = events.find((e) => e.event_type === defaultEvt.event_type);
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
        }
      } else {
        // Create new draft
        const { data: newInv, error } = await supabase
          .from("invitations")
          .insert({ user_id: user.id, template_id: templateId })
          .select()
          .single();

        if (newInv) {
          setInvitationId(newInv.id);
          // Insert default events
          await supabase.from("events").insert(
            formData.events.map((e) => ({
              invitation_id: newInv.id,
              event_type: e.event_type,
              event_name: e.event_name,
              is_enabled: e.is_enabled,
            }))
          );
        }
      }
    };

    loadOrCreate();
  }, [user, templateId]);

  // Auto-save every 30 seconds
  const saveToSupabase = useCallback(async () => {
    if (!invitationId || !user) return;

    await supabase
      .from("invitations")
      .update({
        bride_name: formData.bride_name || null,
        groom_name: formData.groom_name || null,
        bride_family: formData.bride_family || null,
        groom_family: formData.groom_family || null,
        personal_message: formData.personal_message || null,
        photo_url: formData.photo_url,
        language: formData.language,
        upi_id: formData.upi_id || null,
        gift_registry_url: formData.gift_registry_url || null,
      })
      .eq("id", invitationId);

    // Upsert events
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
        })
        .eq("invitation_id", invitationId)
        .eq("event_type", event.event_type);
    }
  }, [invitationId, user, formData]);

  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      saveToSupabase();
    }, 30000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [saveToSupabase]);

  const updateFormData = (updates: Partial<BuilderFormData>) => {
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

    // Save final data
    await saveToSupabase();

    // Generate slug
    const slug = `${formData.bride_name.toLowerCase()}-${formData.groom_name.toLowerCase()}-${Date.now().toString(36)}`;

    // Update invitation
    const { error } = await supabase
      .from("invitations")
      .update({ status: "published", plan, slug })
      .eq("id", invitationId);

    setPublishLoading(false);

    if (error) {
      toast("Failed to publish. Please try again.");
      return;
    }

    toast("🎉 Your invitation is live!");
    navigate("/dashboard");
  };

  if (!template || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1CoupleNames data={formData} onChange={updateFormData} errors={errors} />;
      case 2:
        return <Step2Events data={formData} onChange={updateFormData} errors={errors} />;
      case 3:
        return <Step3PhotoLanguage data={formData} onChange={updateFormData} errors={errors} />;
      case 4:
        return <Step4Preview data={formData} template={template} onProceed={() => setStep(5)} onGoBack={() => setStep(3)} />;
      case 5:
        return <Step5Publish onSelectPlan={handlePublish} loading={publishLoading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StepIndicator currentStep={step} totalSteps={5} />

      <div className="flex-1 flex">
        {/* Form panel */}
        <div className={`${isMobile ? "w-full" : "w-2/5"} overflow-y-auto`}>
          <div className="p-6 md:p-8 max-w-xl mx-auto">
            {renderStep()}

            {/* Navigation buttons (not on step 4/5 which have their own) */}
            {step <= 3 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="rounded-none font-body gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-body gap-2"
                >
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
                <LivePreview data={formData} template={template} />
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
            <LivePreview data={formData} template={template} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationBuilder;
