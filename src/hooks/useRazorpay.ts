import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PaymentFailureData } from "@/components/PaymentFailedModal";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const PLAN_CONFIG = {
  shubh: { name: "Shubh", amount: 99900 },
  shaadi: { name: "Shaadi", amount: 199900 },
  shaahi: { name: "Shaahi", amount: 349900 },
} as const;

export type PlanId = keyof typeof PLAN_CONFIG;

const PENDING_KEY = "pending_plan_activation";

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) { existing.addEventListener("load", () => resolve()); return; }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export interface PaymentSuccessData {
  planId: PlanId;
  amount: number;
  razorpayOrderId: string;
}

export function useRazorpay() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshPlan } = usePlan();
  const processingRef = useRef(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [signupModalData, setSignupModalData] = useState<PaymentSuccessData | null>(null);
  const [failureModalData, setFailureModalData] = useState<PaymentFailureData | null>(null);

  // Store last order info for retry
  const lastOrderRef = useRef<{ orderId: string; planId: PlanId; createdAt: number } | null>(null);

  const logFailedPayment = useCallback(async (payload: Record<string, unknown>) => {
    try {
      await supabase.functions.invoke("log-failed-payment", { body: payload });
    } catch (e) {
      console.error("Failed to log payment failure:", e);
    }
  }, []);

  const openCheckout = useCallback(async (planId: PlanId, existingOrderId?: string) => {
    if (processingRef.current) return;

    processingRef.current = true;
    const plan = PLAN_CONFIG[planId];
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SP8s2WhxqMj8BB";

    setSelectedPlan(planId);
    setSelectedAmount(plan.amount);
    setFailureModalData(null);

    if (!keyId) {
      toast.error("Payment gateway is not configured. Please contact support.");
      processingRef.current = false;
      return;
    }

    try {
      await loadRazorpayScript();
    } catch {
      toast.error("Could not load payment gateway. Please try again.");
      processingRef.current = false;
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway unavailable. Please refresh and try again.");
      processingRef.current = false;
      return;
    }

    let orderId = existingOrderId;

    // Create new order if not retrying with existing one
    if (!orderId) {
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: plan.amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            plan: planId,
          },
        }
      );

      if (orderError || !orderData?.id) {
        console.error("Order creation failed:", orderError || orderData);
        toast.error("Could not create order. Please try again.");
        processingRef.current = false;
        return;
      }
      orderId = orderData.id;
    }

    lastOrderRef.current = { orderId: orderId!, planId, createdAt: Date.now() };

    const options: RazorpayOptions = {
      key: keyId,
      amount: plan.amount,
      currency: "INR",
      name: "Shaadi.Digital",
      description: `${plan.name} Wedding Invitation Plan`,
      order_id: orderId!,
      image: "https://shaadi.digital/favicon.svg",
      prefill: {
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#C9941A" },
      external: { wallets: ["amazonpay"] },
      handler: async (response: any) => {
        processingRef.current = false;

        // Verify payment server-side
        const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
          "verify-razorpay-payment",
          {
            body: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
              email: user?.email || "",
              amount: plan.amount,
            },
          }
        );

        if (verifyError || !verifyData?.success) {
          toast.error("Payment verification failed. Please contact support.");
          return;
        }

        // If user is already logged in, activate plan directly
        if (user) {
          const now = new Date();
          const expiresAt = new Date(now);
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);

          const { error: planError } = await (supabase.from("user_plans" as any) as any).insert({
            user_id: user.id,
            plan: planId,
            razorpay_order_id: response.razorpay_order_id,
            activated_at: now.toISOString(),
            expires_at: expiresAt.toISOString(),
          });

          if (planError) {
            console.error("Plan activation failed:", planError);
            localStorage.setItem(PENDING_KEY, JSON.stringify({
              plan: planId,
              razorpay_order_id: response.razorpay_order_id,
            }));
          }

          await refreshPlan();
          toast.success(`🎉 Welcome to ${plan.name} Plan! All features are now unlocked.`);
          setTimeout(() => navigate("/dashboard"), 1500);
          return;
        }

        // Not logged in — show signup modal
        setSignupModalData({
          planId,
          amount: plan.amount,
          razorpayOrderId: response.razorpay_order_id,
        });
      },
      modal: {
        ondismiss: () => {
          processingRef.current = false;

          // Log abandonment
          logFailedPayment({
            razorpay_order_id: orderId,
            plan: planId,
            amount: plan.amount,
            email: user?.email || "",
            status: "abandoned",
          });

          // Check if order is still valid (< 15 min old)
          const orderAge = lastOrderRef.current
            ? Date.now() - lastOrderRef.current.createdAt
            : Infinity;
          const isOrderValid = orderAge < 15 * 60 * 1000;

          toast(
            "Changed your mind? Your plan is saved — complete payment anytime.",
            {
              icon: "ℹ️",
              duration: 8000,
              action: isOrderValid
                ? {
                    label: "Resume →",
                    onClick: () => openCheckout(planId, orderId),
                  }
                : undefined,
            }
          );
        },
      },
    };

    const rzp = new window.Razorpay(options);
    (rzp as any).on("payment.failed", (response: any) => {
      processingRef.current = false;

      const errorData = response.error || {};

      // Log the failure
      logFailedPayment({
        razorpay_order_id: errorData.metadata?.order_id || orderId,
        razorpay_payment_id: errorData.metadata?.payment_id || "",
        failure_code: errorData.code || "",
        failure_reason: errorData.reason || errorData.description || "",
        failure_source: errorData.source || "",
        failure_step: errorData.step || "",
        plan: planId,
        amount: plan.amount,
        email: user?.email || "",
        status: "failed",
      });

      // Show failure modal
      setFailureModalData({
        planId,
        failureCode: errorData.code || errorData.reason || "",
        failureReason: errorData.description || errorData.reason || "",
        orderId: errorData.metadata?.order_id || orderId,
      });
    });
    rzp.open();
  }, [user, navigate, refreshPlan, logFailedPayment]);

  const retryPayment = useCallback(() => {
    if (!failureModalData) return;
    const { planId, orderId } = failureModalData;

    // Check if order is still valid (< 15 min)
    const orderAge = lastOrderRef.current
      ? Date.now() - lastOrderRef.current.createdAt
      : Infinity;
    const isOrderValid = orderAge < 15 * 60 * 1000;

    setFailureModalData(null);
    openCheckout(planId, isOrderValid ? orderId : undefined);
  }, [failureModalData, openCheckout]);

  const closeSignupModal = useCallback(() => {
    setSignupModalData(null);
  }, []);

  const closeFailureModal = useCallback(() => {
    setFailureModalData(null);
  }, []);

  return {
    openCheckout,
    selectedPlan,
    selectedAmount,
    signupModalData,
    closeSignupModal,
    failureModalData,
    closeFailureModal,
    retryPayment,
  };
}
