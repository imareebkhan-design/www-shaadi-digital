import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const PLAN_CONFIG = {
  shubh: { name: "Shubh Plan", amount: 99900 },
  shaadi: { name: "Shaadi Plan", amount: 199900 },
  shaahi: { name: "Shaahi Plan", amount: 349900 },
} as const;

type PlanId = keyof typeof PLAN_CONFIG;

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const processingRef = useRef(false);

  const openCheckout = useCallback(async (planId: PlanId) => {
    if (processingRef.current) return;
    processingRef.current = true;

    const plan = PLAN_CONFIG[planId];
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

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
      handler: (response) => {
        processingRef.current = false;
        console.log("Payment success:", response);
        toast.success(`Payment successful! Welcome to ${plan.name} 🎉`);
        navigate("/dashboard");
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
  }, [user, navigate]);

  return { openCheckout };
}

export type { PlanId };
