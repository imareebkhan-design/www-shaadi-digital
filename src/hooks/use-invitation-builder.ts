import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { TEMPLATE_REGISTRY } from "@/templates";
import type { InvitationData } from "@/templates/types";
import type { TemplateWorkflow } from "@/templates/workflow";
import { getVisibleSteps, validateStep, getCeremonyLabel, getVisibleEventTypes, getPaymentPlans } from "@/templates/stepEngine";
import { defaultEvents, DEFAULT_TAGLINES } from "@/types/builder";
import { useRazorpay } from "@/hooks/useRazorpay";
import { fetchDraftInvitation, createDraftInvitation, updateDraftEvents, updateDraftInvitation, updateInvitationTemplate, publishInvitation } from "@/services/invitationService";

const BUILDER_TO_RAZORPAY_PLAN = {
  basic: "shubh",
  premium: "shaadi",
  elite: "shaahi",
} as const;

export const stepLabels = ["Names", "Events", "Photos", "Preview", "Publish"] as const;

export const defaultInvitationData = (ceremonyLabel: string): InvitationData => ({
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
  photo_url: "",
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

export const validateBuilderStep = (step: number, formData: InvitationData, workflow?: TemplateWorkflow) => {
  if (workflow) {
    const visibleSteps = getVisibleSteps(workflow, formData);
    const stepId = visibleSteps[step - 1];
    if (stepId) {
      return validateStep(workflow, stepId, formData);
    }
  }

  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!formData.bride_name.trim()) errors.bride_name = "Bride's name is required";
    if (!formData.groom_name.trim()) errors.groom_name = "Groom's name is required";
  }

  if (step === 2) {
    const ceremonyEvent = formData.events.find((event) => event.event_type === "ceremony");
    if (!ceremonyEvent?.is_enabled) errors.events = "Main Ceremony must be enabled";
  }

  return errors;
};

const slugify = (value: string): string => {
  const normalized = value.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  const latin = normalized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return latin.length >= 2 ? latin : `invite-${Math.random().toString(36).slice(2, 7)}`;
};

export const useInvitationBuilder = (urlTemplateId?: string) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasPlan, plan: userPlan } = usePlan();

  const [activeTemplateId, setActiveTemplateId] = useState(urlTemplateId || "");
  const template = activeTemplateId ? TEMPLATE_REGISTRY[activeTemplateId] : null;

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [weddingType, setWeddingType] = useState("hindu");
  const [prePaymentPlan, setPrePaymentPlan] = useState<"basic" | "premium" | "elite" | null>(null);
  const [formData, setFormData] = useState<InvitationData>(() => defaultInvitationData(getCeremonyLabel(template?.community || "")));

  const saveRef = useRef<() => Promise<void>>(async () => {});
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPublishPlan = useRef<"basic" | "premium" | "elite" | null>(null);
  const initialEvents = useRef(formData.events);

  const { openCheckout, signupModalData, closeSignupModal, failureModalData, closeFailureModal, retryPayment } = useRazorpay({
    onPaymentSuccess: async (razorpayOrderId) => {
      if (pendingPublishPlan.current) {
        await doPublish(pendingPublishPlan.current, razorpayOrderId);
        pendingPublishPlan.current = null;
      }
    },
  });

  useEffect(() => {
    if (urlTemplateId && urlTemplateId !== activeTemplateId) {
      setActiveTemplateId(urlTemplateId);
    }
  }, [urlTemplateId, activeTemplateId]);

  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem("selectedTemplateId", activeTemplateId || "");
      navigate("/login");
    }
  }, [authLoading, user, navigate, activeTemplateId]);

  useEffect(() => {
    if (!authLoading && !template) {
      navigate("/templates");
    }
  }, [template, navigate, authLoading]);

  useEffect(() => {
    if (!user || !activeTemplateId) return;

    const loadOrCreate = async () => {
      setIsLoadingData(true);

      const { invitation, events } = await fetchDraftInvitation(user.id, activeTemplateId);

      if (invitation) {
        setInvitationId(invitation.id);
        setFormData((prev) => ({
          ...prev,
          bride_name: invitation.bride_name || "",
          groom_name: invitation.groom_name || "",
          bride_family: invitation.bride_family || "",
          groom_family: invitation.groom_family || "",
          bride_full_name: invitation.bride_full_name || "",
          groom_full_name: invitation.groom_full_name || "",
          bride_bio: invitation.bride_bio || "",
          groom_bio: invitation.groom_bio || "",
          personal_message: invitation.personal_message || "",
          our_story: invitation.our_story || "",
          wedding_date: invitation.wedding_date || events.find((event) => event.event_type === "ceremony")?.event_date || "",
          wedding_city: invitation.wedding_city || "",
          photo_url: invitation.photo_url || undefined,
          gallery_photos: invitation.gallery_photos || [],
          language: invitation.language || "english",
          upi_id: invitation.upi_id || "",
          gift_registry_url: invitation.gift_registry_url || "",
          dresscode_enabled: invitation.dresscode_enabled || false,
          dresscode_text: invitation.dresscode_text || "",
          dresscode_colors: invitation.dresscode_colors || [],
          music_url: invitation.music_url || "",
          venue_description: invitation.venue_description || "",
          venue_photo: invitation.venue_photo || "",
          rsvp_deadline: invitation.rsvp_deadline || "",
          hero_media_type: invitation.hero_media_type || "photo",
          hero_media_url: invitation.hero_media_url || "",
          events: prev.events.map((defaultEvt) => {
            const saved = events.find((event) => event.event_type === defaultEvt.event_type);
            if (!saved) return defaultEvt;
            return {
              ...defaultEvt,
              is_enabled: saved.is_enabled,
              event_date: saved.event_date || "",
              event_time: saved.event_time || "",
              venue_name: saved.venue_name || "",
              venue_address: saved.venue_address || "",
              maps_url: saved.maps_url || "",
              tagline: saved.tagline || DEFAULT_TAGLINES[saved.event_type] || "",
              description: saved.description || "",
              event_photo: saved.event_photo || "",
            };
          }),
        }));
      } else {
        const newInvitation = await createDraftInvitation(user.id, activeTemplateId, initialEvents.current);
        if (newInvitation) {
          setInvitationId(newInvitation.id);
        }
      }

      setIsLoadingData(false);
    };

    loadOrCreate();
  }, [activeTemplateId, user]);

  const saveToSupabase = useCallback(async () => {
    if (!invitationId || !user) return;
    setSaveStatus("saving");

    await updateDraftInvitation(invitationId, formData);
    await updateDraftEvents(invitationId, formData.events);

    setSaveStatus("saved");
    if (savedTimeout.current) clearTimeout(savedTimeout.current);
    savedTimeout.current = setTimeout(() => setSaveStatus("idle"), 3000);
  }, [formData, invitationId, user]);

  useEffect(() => {
    saveRef.current = saveToSupabase;
  }, [saveToSupabase]);

  useEffect(() => {
    autoSaveTimer.current = setInterval(() => saveRef.current(), 30_000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, []);

  const handleBlur = useCallback(() => {
    saveToSupabase();
  }, [saveToSupabase]);

  const handleWeddingTypeChange = useCallback((type: string) => {
    setWeddingType(type);
    if (!template?.workflow) return;

    const ceremonyName = getCeremonyLabel(template.workflow, type);
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((event) =>
        event.event_type === "ceremony"
          ? { ...event, event_name: ceremonyName }
          : event,
      ),
    }));
  }, [template?.workflow]);

  const updateFormData = useCallback((updates: Partial<InvitationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const validateStep = useCallback((stepNumber: number) => {
    const newErrors = validateBuilderStep(stepNumber, formData, template?.workflow);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, template?.workflow]);

  const handleNext = useCallback(async () => {
    if (!validateStep(step)) return;
    await saveToSupabase();
    const maxStep = template?.workflow ? getVisibleSteps(template.workflow, formData).length : stepLabels.length;
    setStep((current) => Math.min(current + 1, maxStep));
  }, [saveToSupabase, step, validateStep, template?.workflow, formData]);

  const handleBack = useCallback(() => setStep((current) => Math.max(current - 1, 1)), []);

  const doPublish = useCallback(async (selectedPlan: "basic" | "premium" | "elite", razorpayOrderId: string) => {
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

    const { error } = await publishInvitation(invitationId, selectedPlan, slug, razorpayOrderId);
    setPublishLoading(false);

    if (error) {
      toast("Failed to publish. Please try again.");
      return;
    }

    setPublishedSlug(slug);
    toast("🎉 Your invitation is live!");
  }, [formData.bride_name, formData.groom_name, invitationId, saveToSupabase, user]);

  const handlePublish = useCallback(async (selectedPlan: "basic" | "premium" | "elite") => {
    if (!invitationId || !user) return;

    const storedOrderId = userPlan?.razorpay_order_id || sessionStorage.getItem("last_razorpay_order_id") || "";

    if (hasPlan && storedOrderId) {
      await doPublish(selectedPlan, storedOrderId);
      return;
    }

    setPrePaymentPlan(selectedPlan);
  }, [hasPlan, invitationId, doPublish, user, userPlan]);

  const confirmAndPay = useCallback((selectedPlan: "basic" | "premium" | "elite") => {
    setPrePaymentPlan(null);
    pendingPublishPlan.current = selectedPlan;
    openCheckout(BUILDER_TO_RAZORPAY_PLAN[selectedPlan]);
  }, [openCheckout]);

  const handleTemplateSwitch = useCallback(async (newTemplateId: string) => {
    if (newTemplateId === activeTemplateId || !invitationId) return;
    await updateInvitationTemplate(invitationId, newTemplateId);
    setActiveTemplateId(newTemplateId);
    navigate(`/builder/${newTemplateId}`, { replace: true });
    toast("✓ Template switched! Your details are all here.", {
      duration: 3000,
      position: "top-center",
      style: { background: "#1C1410", color: "#ffffff", border: "none" },
    });
  }, [activeTemplateId, invitationId, navigate]);

  return {
    activeTemplateId,
    template,
    step,
    errors,
    isLoadingData,
    publishLoading,
    publishedSlug,
    saveStatus,
    weddingType,
    prePaymentPlan,
    formData,
    signupModalData,
    failureModalData,
    handleNext,
    handleBack,
    handleWeddingTypeChange,
    updateFormData,
    handlePublish,
    confirmAndPay,
    handleTemplateSwitch,
    handleBlur,
    setPrePaymentPlan,
    setStep,
    closeSignupModal,
    closeFailureModal,
    retryPayment,
  };
};
