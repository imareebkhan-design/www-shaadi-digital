import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const openCheckout = useCallback(async (planId: PlanId) => {
    if (processingRef.current) return;

    processingRef.current = true;
    const plan = PLAN_CONFIG[planId];
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_SP8s2WhxqMj8BB";

    setSelectedPlan(planId);
    setSelectedAmount(plan.amount);

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

    // Create order via edge function
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

    const options: RazorpayOptions = {
      key: keyId,
      amount: plan.amount,
      currency: "INR",
      name: "Shaadi.Digital",
      description: `${plan.name} Wedding Invitation Plan`,
      order_id: orderData.id,
      image: "https://shaadi.digital/favicon.svg",
      prefill: {
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#C9941A" },
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
          toast("Payment cancelled. You can try again anytime.", { icon: "ℹ️" });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    (rzp as any).on("payment.failed", () => {
      processingRef.current = false;
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
  }, [user, navigate, refreshPlan]);

  const closeSignupModal = useCallback(() => {
    setSignupModalData(null);
  }, []);

  return { openCheckout, selectedPlan, selectedAmount, signupModalData, closeSignupModal };
}
