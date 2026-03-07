import { useState } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    // Create user profile record
    if (data.user) {
      await supabase.from("users").insert({
        auth_user_id: data.user.id,
        mobile: "",
        full_name: fullName.trim(),
        email: email.trim(),
      });
    }

    setLoading(false);
    // Check redirect targets
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    const postLogin = sessionStorage.getItem("postLoginRedirect");

    if (redirect === "pricing" || postLogin === "/pricing") {
      sessionStorage.removeItem("postLoginRedirect");
      navigate("/pricing");
    } else {
      const templateId = sessionStorage.getItem("selectedTemplateId");
      if (templateId) {
        sessionStorage.removeItem("selectedTemplateId");
        navigate(`/builder/${templateId}`);
      } else {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <SEOHead
        title="Create Free Wedding Invitation | Shaadi.Digital"
        description="Sign up free and design your digital wedding invitation in 10 minutes. 200+ templates, WhatsApp delivery & live RSVP tracking. Trusted by 50,000+ couples."
        canonical="https://shaadi.digital/signup"
        noIndex
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://shaadi.digital" },
            { "@type": "ListItem", "position": 2, "name": "Sign Up", "item": "https://shaadi.digital/signup" }
          ]
        })}</script>
      </Helmet>
      <div className="absolute inset-0 mandala-bg opacity-30" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-card border border-border shadow-lg p-8 md:p-10">
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

          <div className="space-y-5">
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                Full Name
              </label>
              <Input
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="font-body min-h-[52px] text-[16px] md:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body min-h-[52px] text-[16px] md:text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-body"
              />
            </div>

            {error && <p className="text-sm text-destructive font-body">{error}</p>}

            <Button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 font-body"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Create Account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-body">or</span></div>
            </div>

            <Button
              variant="outline"
              onClick={async () => {
                setError("");
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) setError(error.message);
              }}
              className="w-full rounded-none h-11 font-body gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                setError("");
                const { error } = await lovable.auth.signInWithOAuth("apple", {
                  redirect_uri: window.location.origin,
                });
                if (error) setError(error.message);
              }}
              className="w-full rounded-none h-11 font-body gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </Button>
          </div>

          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground font-body">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-sm font-body">
              <Link to="/templates" className="text-primary font-medium hover:underline">
                Browse 200+ templates first →
              </Link>
            </p>
          </div>

        <p className="text-sm text-muted-foreground font-body text-center mt-6 leading-relaxed max-w-md mx-auto">
          Already browsing? You're moments away from a beautiful digital wedding invitation. Join 50,000+ couples who chose Shaadi.Digital — pick your template, add your details, and share via WhatsApp in under 10 minutes. Preview is completely free, no card required.
        </p>
      </div>
      </div>
    </div>
  );
};

export default SignUp;
