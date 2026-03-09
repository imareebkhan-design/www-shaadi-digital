import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePlan } from "@/contexts/PlanContext";
import { CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import type { PlanId } from "@/hooks/useRazorpay";

const PLAN_DISPLAY: Record<string, { label: string; price: string }> = {
  shubh: { label: "Shubh Plan", price: "₹999" },
  shaadi: { label: "Shaadi Plan", price: "₹1,999" },
  shaahi: { label: "Shaahi Plan", price: "₹3,499" },
};

interface PostPaymentSignupModalProps {
  open: boolean;
  planId: PlanId;
  amount: number;
  razorpayOrderId: string;
  onClose: () => void;
}

const PostPaymentSignupModal = ({
  open,
  planId,
  amount,
  razorpayOrderId,
  onClose,
}: PostPaymentSignupModalProps) => {
  const navigate = useNavigate();
  const { refreshPlan } = usePlan();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const displayAmount = `₹${(amount / 100).toLocaleString("en-IN")}`;
  const planInfo = PLAN_DISPLAY[planId] || { label: planId, price: displayAmount };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || password.length < 8) {
      toast.error("Please fill all required fields. Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create user via Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || undefined,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        setLoading(false);
        return;
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        toast.error("Account creation failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Update payments table — set user_id where razorpay_order_id matches
      await (supabase.from("payments" as any) as any)
        .update({ user_id: userId, email: email.trim() })
        .eq("razorpay_order_id", razorpayOrderId);

      // 3. Insert into user_plans
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error: planError } = await (supabase.from("user_plans" as any) as any).insert({
        user_id: userId,
        plan: planId,
        razorpay_order_id: razorpayOrderId,
        activated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      });

      if (planError) {
        console.error("Plan activation failed:", planError);
        // Store pending so PlanContext retries on next load
        localStorage.setItem("pending_plan_activation", JSON.stringify({
          plan: planId,
          razorpay_order_id: razorpayOrderId,
        }));
      }

      await refreshPlan();
      toast.success(`🎉 Welcome to ${planInfo.label}! Let's design your invite.`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    onClose();
    navigate("/login?redirect=dashboard");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative w-full max-w-md bg-card rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Gold top accent */}
        <div className="h-1.5" style={{ background: "#C9941A" }} />

        <div className="p-8">
          {/* Checkmark */}
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(34, 197, 94, 0.1)" }}
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="font-display text-2xl font-bold text-center mb-1"
            style={{ color: "#7B1C2E" }}
          >
            Payment Confirmed! ✓
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-4">
            Your {displayAmount} payment is confirmed.
            <br />
            Create your account to start designing.
          </p>

          {/* Plan badge */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full"
              style={{ background: "rgba(201, 148, 26, 0.12)", color: "#C9941A", border: "1px solid rgba(201, 148, 26, 0.3)" }}
            >
              {planInfo.label} — {planInfo.price}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rahul & Priya"
                className="w-full px-3 py-2.5 border border-secondary/20 rounded-none bg-background text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border border-secondary/20 rounded-none bg-background text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2.5 border border-secondary/20 rounded-none bg-background text-sm focus:outline-none focus:border-secondary transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Phone Number <span className="text-muted-foreground">(optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2.5 border border-secondary/20 rounded-none bg-background text-sm focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs font-semibold tracking-[1.5px] uppercase text-white transition-all disabled:opacity-60"
              style={{ background: "#7B1C2E" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account…
                </span>
              ) : (
                "Create My Account →"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Already have an account?{" "}
            <button
              onClick={handleSignInClick}
              className="underline font-medium"
              style={{ color: "#C9941A" }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostPaymentSignupModal;
