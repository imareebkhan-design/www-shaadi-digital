import { useState } from "react";
import type { BuilderFormData } from "@/types/builder";
import SEOHead from "@/components/SEOHead";
import ErrorState from "@/components/ui/ErrorState";
import { useParams } from "react-router-dom";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useInvitationBuilder } from "@/hooks/use-invitation-builder";
import { getVisibleSteps, renderDynamicStep } from "@/templates/stepEngine";
import { AnimatePresence } from "framer-motion";

const InvitationBuilder = () => {
  const { templateId: urlTemplateId } = useParams<{ templateId: string }>();
  const isMobile = useIsMobile();
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);

  const {
    activeTemplateId,
    template,
    step,
    maxStep,
    errors,
    isLoadingData,
    publishLoading,
    publishedSlug,
    saveStatus,
    saveError,
    templateLoadError,
    draftLoadError,
    unsavedChanges,
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
  } = useInvitationBuilder(urlTemplateId);

  const stepLabelMap = {
    names: "Names",
    events: "Events",
    photos: "Photos",
    preview: "Preview",
    publish: "Publish",
  } as const;

  const workflowSteps = template?.workflow ? getVisibleSteps(template.workflow, formData) : undefined;
  const workflowLabels = workflowSteps?.map((stepId) => stepLabelMap[stepId]) ?? undefined;

  const renderStep = () => {
    if (!template?.workflow) {
      throw new Error(`Template ${activeTemplateId} is missing workflow configuration`);
    }

    return renderDynamicStep({
      workflow: template.workflow,
      currentStep: step,
      formData,
      errors,
      weddingType,
      onWeddingTypeChange: handleWeddingTypeChange,
      updateFormData,
      onProceed: () => setStep((current) => Math.min(current + 1, maxStep)),
      onGoBack: () => setStep((current) => Math.max(current - 1, 1)),
      templateId: activeTemplateId!,
      publishLoading,
      onSelectPlan: handlePublish,
      brideName: formData.bride_name,
      groomName: formData.groom_name,
      weddingDate: formData.wedding_date,
    });
  };

  if (templateLoadError) {
    return (
      <ErrorState
        title="Template Not Found"
        message={templateLoadError}
        ctaLabel="Browse templates"
        ctaHref="/templates"
      />
    );
  }

  if (draftLoadError) {
    return (
      <ErrorState
        title="Unable to Load Draft"
        message={draftLoadError}
        ctaLabel="Go home"
        ctaHref="/"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background" onBlur={handleBlur}>
      <SEOHead
        title="Build Your Invitation — Shaadi.Digital"
        description="Customise your digital wedding invitation with couple names, events, photos, and more."
        noIndex
      />

      {/* Save failure banner */}
      {saveStatus === "failed" && saveError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-destructive/20 border border-destructive/50 px-4 py-3 rounded-full font-body text-xs text-destructive shadow-md">
          <span>⚠️</span>
          {saveError}
        </div>
      )}

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
          <StepIndicator currentStep={step} totalSteps={maxStep} labels={workflowLabels} templateId={activeTemplateId} onChangeTemplate={() => setShowTemplateSwitcher(true)} />

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
              {/* Scrollable template inside — zoom scales layout correctly, scroll works */}
              <div
                className="absolute overflow-y-auto overflow-x-hidden"
                style={{ top: 8, left: 8, right: 8, bottom: 8, borderRadius: 32 }}
              >
                <div style={{ width: 430, zoom: 0.614 }}>
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
