import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePlan } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const PLAN_CONFIG = {
  shubh: { name: "Shubh Plan", amount: 99900 },
  shaadi: { name: "Shaadi Plan", amount: 199900 },
  shaahi: { name: "Shaahi Plan", amount: 349900 },
} as const;

type PlanId = keyof typeof PLAN_CONFIG;

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

async function savePaymentAndPlan(
  userId: string,
  planId: PlanId,
  planConfig: typeof PLAN_CONFIG[PlanId],
  email: string,
  response: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }
) {
  const orderId = response.razorpay_order_id || response.razorpay_payment_id;

  // Save payment record
  const { error: payError } = await (supabase.from("payments" as any) as any).insert({
    user_id: userId,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: orderId,
    razorpay_signature: response.razorpay_signature || null,
    amount: planConfig.amount,
    plan: planId,
    email,
    status: "success",
  });

  if (payError) {
    console.error("Payment record save failed:", payError);
  }

  // Insert user plan
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const { error: planError } = await (supabase.from("user_plans" as any) as any).insert({
    user_id: userId,
    plan: planId,
    razorpay_order_id: orderId,
    activated_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  });

  if (planError) {
    console.error("Plan activation save failed:", planError);
    localStorage.setItem(PENDING_KEY, JSON.stringify({
      plan: planId,
      razorpay_order_id: orderId,
    }));
  }

  return { payError, planError };
}

export function useRazorpay() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshPlan } = usePlan();
  const processingRef = useRef(false);

  const openCheckout = useCallback(async (planId: PlanId) => {
    if (processingRef.current) return;

    // Auth gate
    if (!user) {
      sessionStorage.setItem("postLoginRedirect", "/pricing");
      navigate("/login?redirect=pricing");
      return;
    }

    processingRef.current = true;
    const plan = PLAN_CONFIG[planId];
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SOSdB20AeYe8nR";

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

    const options: RazorpayOptions = {
      key: keyId,
      amount: plan.amount,
      currency: "INR",
      name: "Shaadi.Digital",
      description: plan.name,
      image: "https://shaadi.digital/favicon.svg",
      prefill: {
        name: user?.user_metadata?.full_name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      theme: { color: "#7B1C2E" },
      handler: async (response) => {
        processingRef.current = false;

        // Save to DB
        await savePaymentAndPlan(user.id, planId, plan, user.email || "", response);

        // Refresh plan context
        await refreshPlan();

        toast.success(`🎉 Welcome to ${plan.name}! All features are now unlocked.`);

        setTimeout(() => navigate("/dashboard"), 1500);
      },
      modal: {
        ondismiss: () => {
          processingRef.current = false;
          toast("Payment cancelled. You can try again anytime.", { icon: "ℹ️" });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }, [user, navigate, refreshPlan]);

  return { openCheckout };
}

export type { PlanId };
