import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);

        // After OAuth sign-in, redirect to dashboard
        if (event === "SIGNED_IN" && session) {
          const currentPath = window.location.pathname;
          if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
            const postLogin = sessionStorage.getItem("postLoginRedirect");
            if (postLogin) {
              sessionStorage.removeItem("postLoginRedirect");
              window.location.href = postLogin;
            } else {
              const templateId = sessionStorage.getItem("selectedTemplateId");
              if (templateId) {
                sessionStorage.removeItem("selectedTemplateId");
                window.location.href = `/builder/${templateId}`;
              } else {
                window.location.href = "/dashboard";
              }
            }
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
