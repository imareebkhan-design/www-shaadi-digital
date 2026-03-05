import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (num: string) => /^\d{10}$/.test(num);

  const handleSendOtp = async () => {
    setError("");
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validatePhone(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: `+91${mobile}`,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setStep("otp");
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      phone: `+91${mobile}`,
      token: otp,
      type: "sms",
    });
    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    // Create user profile record
    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        auth_user_id: data.user.id,
        mobile: `+91${mobile}`,
        full_name: fullName.trim(),
      });
      if (insertError && !insertError.message.includes("duplicate")) {
        setLoading(false);
        setError("Account created but profile save failed. Please try logging in.");
        return;
      }
    }

    setLoading(false);
    const templateId = sessionStorage.getItem("selectedTemplateId");
    if (templateId) {
      sessionStorage.removeItem("selectedTemplateId");
      navigate(`/builder/${templateId}`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Mandala background decoration */}
      <div className="absolute inset-0 mandala-bg opacity-30" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border shadow-lg p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="font-display text-2xl text-primary">
                Shaadi<span className="text-secondary">.</span>Digital
              </h1>
            </Link>
          </div>

          <h2 className="font-display text-2xl text-primary text-center mb-2">
            Create Your Account
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8 font-body">
            Sign up to start creating your dream wedding invitation
          </p>

          {step === "phone" ? (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                  Full Name
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="font-body"
                />
              </div>
              <div>
                <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 border border-input bg-muted text-sm font-body text-muted-foreground min-w-[52px]">
                    +91
                  </div>
                  <Input
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="font-body"
                    type="tel"
                    maxLength={10}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive font-body">{error}</p>}

              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 font-body"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-body font-medium text-foreground block mb-1.5 text-center">
                  Enter the 6-digit OTP sent to +91{mobile}
                </label>
                <div className="flex justify-center mt-4">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {error && <p className="text-sm text-destructive font-body text-center">{error}</p>}

              <Button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 font-body"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Verify & Sign Up
              </Button>

              <button
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="text-sm text-muted-foreground hover:text-primary font-body w-full text-center"
              >
                Change number
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-body">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
