import { useState, useEffect, useCallback, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { TEMPLATE_REGISTRY } from "@/templates";
import type { InvitationData } from "@/templates/types";
import { invitationDataToConfig } from "@/templates/types";
import { WeddingTemplate } from "@/templates/WeddingTemplate";
import StepIndicator from "@/components/builder/StepIndicator";
import Step1CoupleNames from "@/components/builder/Step1CoupleNames";
import Step2Events from "@/components/builder/Step2Events";
import BuilderHelpCard from "@/components/builder/BuilderHelpCard";
import Step3PhotoLanguage from "@/components/builder/Step3PhotoLanguage";
import Step4Preview from "@/components/builder/Step4Preview";
import Step5Publish from "@/components/builder/Step5Publish";
import PublishSuccess from "@/components/builder/PublishSuccess";
import TemplateSwitcherModal from "@/components/builder/TemplateSwitcherModal";
import PaymentFailedModal from "@/components/PaymentFailedModal";
import PostPaymentSignupModal from "@/components/PostPaymentSignupModal";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeft, ArrowRight, X, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRazorpay } from "@/hooks/useRazorpay";
import { defaultEvents, DEFAULT_TAGLINES, CEREMONY_NAME_BY_TYPE } from "@/types/builder";
import { AnimatePresence } from "framer-motion";

/** Map builder plan IDs (basic/premium/elite) to Razorpay plan IDs (shubh/shaadi/shaahi) */
const BUILDER_TO_RAZORPAY_PLAN = {
  basic: "shubh",
  premium: "shaadi",
  elite: "shaahi",
} as const;

/**
 * Slugify that gracefully handles non-Latin scripts (Hindi, Urdu, Tamil, etc.).
 * Strips non-ASCII after unicode normalization; falls back to random suffix if result is too short.
 */
const slugify = (s: string): string => {
  const normalized = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const latin = normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return latin.length >= 2 ? latin : `invite-${Math.random().toString(36).slice(2, 7)}`;
};

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
  personal_message: "With joy in our hearts and blessings of our families, we joyfully invite you to celebrate our wedding.",
  our_story: "We met on a rainy evening in Delhi, and from that very first cup of chai, we knew something magical had begun. What started as friendship slowly blossomed into a love story we're proud to share with the people we cherish most.",
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
  const { templateId: urlTemplateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasPlan, plan: userPlan } = usePlan();
  const isMobile = useIsMobile();

  const [activeTemplateId, setActiveTemplateId] = useState(urlTemplateId || "");
  const template = activeTemplateId ? TEMPLATE_REGISTRY[activeTemplateId] : null;
  const TemplateComponent = template?.component;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [weddingType, setWeddingType] = useState("hindu");
  /** Plan staged for payment — shown in pre-payment confirmation modal before Razorpay opens */
  const [prePaymentPlan, setPrePaymentPlan] = useState<"basic" | "premium" | "elite" | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Stores the selected plan while we wait for Razorpay payment to complete. */
  const pendingPublishPlan = useRef<"basic" | "premium" | "elite" | null>(null);

  const [formData, setFormData] = useState<InvitationData>(
    defaultFormData(getCeremonyLabel(template?.community || ""))
  );

  const {
    openCheckout,
    signupModalData,
    closeSignupModal,
    failureModalData,
    closeFailureModal,
    retryPayment,
  } = useRazorpay({
    onPaymentSuccess: async (razorpayOrderId) => {
      if (pendingPublishPlan.current) {
        await doPublish(pendingPublishPlan.current, razorpayOrderId);
        pendingPublishPlan.current = null;
      }
    },
  });

  // Keep activeTemplateId in sync with URL changes
  useEffect(() => {
    if (urlTemplateId && urlTemplateId !== activeTemplateId) {
      setActiveTemplateId(urlTemplateId);
    }
  }, [urlTemplateId]);

  // Template switch handler
  const handleTemplateSwitch = useCallback(async (newTemplateId: string) => {
    if (newTemplateId === activeTemplateId) return;
    
    // Update DB
    if (invitationId) {
      await supabase
        .from("invitations")
        .update({ template_id: newTemplateId } as any)
        .eq("id", invitationId);
    }

    setActiveTemplateId(newTemplateId);
    setShowTemplateSwitcher(false);

    // Navigate to new URL without losing state
    navigate(`/builder/${newTemplateId}`, { replace: true });

    toast("✓ Template switched! Your details are all here.", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#1C1410",
        color: "#ffffff",
        border: "none",
      },
    });
  }, [activeTemplateId, invitationId, navigate]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem("selectedTemplateId", activeTemplateId || "");
      navigate("/login");
    }
  }, [authLoading, user, navigate, activeTemplateId]);

  // Redirect if invalid template
  useEffect(() => {
    if (!authLoading && !template) navigate("/templates");
  }, [template, navigate, authLoading]);

  // Create or load invitation
  useEffect(() => {
    if (!user || !activeTemplateId) return;

    const loadOrCreate = async () => {
      setIsLoadingData(true);
      const { data: existing } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .eq("template_id", activeTemplateId)
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
          .insert({ user_id: user.id, template_id: activeTemplateId })
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

      setIsLoadingData(false);
    };

    loadOrCreate();
  }, [user, activeTemplateId]);

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

  /**
   * Stable ref that always points to the latest saveToSupabase.
   * Lets the interval call it without resetting on every formData change.
   */
  const saveRef = useRef<() => Promise<void>>(async () => {});
  useEffect(() => { saveRef.current = saveToSupabase; }, [saveToSupabase]);

  // Auto-save every 30 seconds — interval is created ONCE and never reset.
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => saveRef.current(), 30_000);
    return () => { if (autoSaveTimer.current) clearInterval(autoSaveTimer.current); };
  }, []); // ← intentionally empty: interval must not reset on every keystroke

  const handleBlur = useCallback(() => { saveToSupabase(); }, [saveToSupabase]);

  /** When user picks a wedding type, update state and rename the ceremony event accordingly. */
  const handleWeddingTypeChange = useCallback((type: string) => {
    setWeddingType(type);
    const ceremonyName = CEREMONY_NAME_BY_TYPE[type] || "Wedding Ceremony";
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.event_type === "ceremony" ? { ...e, event_name: ceremonyName } : e
      ),
    }));
  }, []);

  const updateFormData = (updates: Partial<InvitationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!formData.bride_name.trim()) newErrors.bride_name = "Bride's name is required";
      if (!formData.groom_name.trim()) newErrors.groom_name = "Groom's name is required";
      // bride_family and groom_family are optional — they improve the invite but shouldn't block progress
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

  /** Core publish — called either directly (if plan exists) or after payment success. */
  const doPublish = useCallback(async (
    selectedPlan: "basic" | "premium" | "elite",
    razorpayOrderId: string,
  ) => {
    if (!invitationId || !user) return;
    setPublishLoading(true);
    await saveToSupabase();

    let slug = `${slugify(formData.bride_name)}-and-${slugify(formData.groom_name)}`;

    const { data: existing } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existing) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error } = await supabase.rpc("publish_invitation" as any, {
      _invitation_id: invitationId,
      _plan: selectedPlan,
      _slug: slug,
      _razorpay_order_id: razorpayOrderId,
    });

    setPublishLoading(false);

    if (error) {
      toast("Failed to publish. Please try again.");
      return;
    }

    setPublishedSlug(slug);
    toast("🎉 Your invitation is live!");
  }, [invitationId, user, formData, saveToSupabase]);

  /**
   * Entry point from Step5Publish CTA.
   * - If user already has an active paid plan → publish directly.
   * - Otherwise → show pre-payment "what you get" modal first, then open Razorpay.
   */
  const handlePublish = useCallback(async (selectedPlan: "basic" | "premium" | "elite") => {
    if (!invitationId || !user) return;

    const storedOrderId =
      (userPlan?.razorpay_order_id) ||
      sessionStorage.getItem("last_razorpay_order_id") ||
      "";

    if (hasPlan && storedOrderId) {
      await doPublish(selectedPlan, storedOrderId);
      return;
    }

    // Show confirmation screen before opening Razorpay
    setPrePaymentPlan(selectedPlan);
  }, [invitationId, user, hasPlan, userPlan, doPublish]);

  /** Called from the pre-payment modal's "Pay & Publish" button */
  const confirmAndPay = useCallback((selectedPlan: "basic" | "premium" | "elite") => {
    setPrePaymentPlan(null);
    pendingPublishPlan.current = selectedPlan;
    openCheckout(BUILDER_TO_RAZORPAY_PLAN[selectedPlan]);
  }, [openCheckout]);

  if (!template || !TemplateComponent || authLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1CoupleNames data={formData as any} onChange={updateFormData as any} errors={errors} weddingType={weddingType} onWeddingTypeChange={handleWeddingTypeChange} />;
      case 2: return <Step2Events data={formData as any} onChange={updateFormData as any} errors={errors} weddingType={weddingType} />;
      case 3: return <Step3PhotoLanguage data={formData as any} onChange={updateFormData as any} errors={errors} />;
      case 4: return (
        <Step4Preview
          data={formData}
          templateId={activeTemplateId!}
          onProceed={() => setStep(5)}
          onGoBack={() => setStep(3)}
        />
      );
      case 5: return publishedSlug ? (
        <PublishSuccess
          brideName={formData.bride_name}
          groomName={formData.groom_name}
          slug={publishedSlug}
          weddingDate={formData.wedding_date}
          weddingCity={formData.wedding_city}
          language={formData.language}
        />
      ) : (
        <Step5Publish onSelectPlan={handlePublish} loading={publishLoading} brideName={formData.bride_name} groomName={formData.groom_name} weddingDate={formData.wedding_date} />
      );
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

      {/* Save status — refined pill */}
      {saveStatus !== "idle" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card/95 backdrop-blur-sm border border-border px-4 py-2 shadow-elegant font-body text-xs text-muted-foreground rounded-full">
          {saveStatus === "saving" ? (
            <>
              <div className="animate-spin w-3 h-3 border border-primary border-t-transparent rounded-full" />
              Auto-saving…
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All changes saved
            </>
          )}
        </div>
      )}

      {/* Mobile sticky bar */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-primary text-primary-foreground py-2.5 px-4 text-center font-display text-sm tracking-wide">
          {formData.groom_name || "Groom"} ♡ {formData.bride_name || "Bride"}
        </div>
      )}

      <div className="flex h-screen">
        {/* ─── LEFT: Form panel (40%) ─── */}
        <div className={`${isMobile ? "w-full" : "w-2/5"} h-screen overflow-y-auto border-r border-border relative`}>
          <StepIndicator currentStep={step} totalSteps={5} templateId={activeTemplateId} onChangeTemplate={() => setShowTemplateSwitcher(true)} />

          <div className="p-6 md:p-8 max-w-xl mx-auto pb-32">
            {renderStep()}

            {step <= 3 && (
              <div className="flex justify-between mt-10 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                  className="rounded-none font-body gap-2 h-11 px-6 border-border/60"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-body gap-2 h-11 px-8 shadow-sm"
                >
                  {step === 3 ? "Preview" : "Next"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          {!isMobile && <BuilderHelpCard />}
        </div>

        {/* ─── RIGHT: iPhone 16 Pro Max frame preview (60%) — desktop only ─── */}
        {!isMobile && (
          <div className="w-3/5 h-screen sticky top-0 flex flex-col items-center justify-center bg-muted/20">
            {/* Label */}
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-4">Live Preview</p>

            {/* iPhone 16 Pro Max: 430×932 logical, scaled to fit */}
            <div className="relative" style={{ width: 280, height: 606 }}>
              {/* Phone frame */}
              <div
                className="absolute inset-0 rounded-[40px] pointer-events-none z-10"
                style={{
                  border: "8px solid #1a1a1a",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08), inset 0 0 0 2px #333",
                }}
              />
              {/* Dynamic Island notch */}
              <div
                className="absolute top-[10px] left-1/2 -translate-x-1/2 z-20 rounded-full"
                style={{ width: 72, height: 20, background: "#1a1a1a" }}
              />
              {/* Scrollable template inside, scaled down */}
              <div
                className="absolute overflow-hidden"
                style={{ top: 8, left: 8, right: 8, bottom: 8, borderRadius: 32 }}
              >
                <div
                  className="overflow-y-auto"
                  style={{
                    width: 430,
                    height: 932,
                    transform: "scale(0.614)",
                    transformOrigin: "top left",
                  }}
                >
                  <WeddingTemplate config={invitationDataToConfig(formData)} templateId={activeTemplateId!} />
                </div>
              </div>
              {/* Home indicator */}
              <div
                className="absolute bottom-[14px] left-1/2 -translate-x-1/2 z-30 rounded-full"
                style={{ width: 80, height: 4, background: "rgba(255,255,255,0.5)" }}
              />
            </div>

            <p className="font-body text-[10px] text-muted-foreground mt-4">Changes update in real-time</p>
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
              <WeddingTemplate config={invitationDataToConfig(formData)} templateId={activeTemplateId!} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
              <Button onClick={() => setShowMobilePreview(false)} className="w-full bg-primary text-primary-foreground rounded-none h-12 font-body">
                Looks good — continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Template Switcher Modal */}
      <AnimatePresence>
        {showTemplateSwitcher && (
          <TemplateSwitcherModal
            currentTemplateId={activeTemplateId}
            formData={formData}
            onSwitch={handleTemplateSwitch}
            onClose={() => setShowTemplateSwitcher(false)}
          />
        )}
      </AnimatePresence>

      {/* Post-payment signup modal (for unauthenticated payments — edge case) */}
      {signupModalData && (
        <PostPaymentSignupModal
          open={!!signupModalData}
          planId={signupModalData.planId}
          amount={signupModalData.amount}
          razorpayOrderId={signupModalData.razorpayOrderId}
          onClose={closeSignupModal}
        />
      )}

      {/* Payment failure modal */}
      {failureModalData && (
        <PaymentFailedModal
          open={!!failureModalData}
          data={failureModalData}
          onRetry={retryPayment}
          onClose={closeFailureModal}
        />
      )}

      {/* ── Pre-payment confirmation modal ── */}
      {prePaymentPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={() => setPrePaymentPlan(null)}
        >
          <div
            className="bg-background border border-border w-full max-w-sm p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <p className="text-2xl mb-2">🎉</p>
              <h3 className="font-display text-xl text-primary mb-1">Ready to go live?</h3>
              <p className="font-body text-xs text-muted-foreground">
                Your invitation is built. Here's what happens next.
              </p>
            </div>

            <div className="space-y-3 py-2 border-t border-b border-border">
              {[
                "Your invite goes live the moment payment clears",
                "Share the link on WhatsApp or copy it anywhere",
                "Edit details anytime — link stays the same forever",
                "Every RSVP appears in your dashboard instantly",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 font-body text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            <div className="space-y-2.5">
              <Button
                className="w-full bg-primary text-primary-foreground rounded-none h-12 font-body text-sm shadow-md"
                onClick={() => confirmAndPay(prePaymentPlan)}
              >
                Pay & Publish →
              </Button>
              <button
                className="w-full font-body text-xs text-muted-foreground py-2 hover:text-foreground transition-colors"
                onClick={() => setPrePaymentPlan(null)}
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvitationBuilder;
