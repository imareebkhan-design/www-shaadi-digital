import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

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
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8 font-body">
            Log in to manage your wedding invitation
          </p>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-body"
              />
            </div>
            <div>
              <label className="text-sm font-body font-medium text-foreground block mb-1.5">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-body"
              />
            </div>

            {error && <p className="text-sm text-destructive font-body">{error}</p>}

            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 font-body"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Log In
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-body">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
