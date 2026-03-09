import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanName = "shubh" | "shaadi" | "shaahi";

interface UserPlan {
  plan: PlanName;
  razorpay_order_id: string | null;
  activated_at: string;
  expires_at: string;
}

interface PlanContextType {
  plan: UserPlan | null;
  loading: boolean;
  hasPlan: boolean;
  refreshPlan: () => Promise<void>;
}

const PlanContext = createContext<PlanContextType>({
  plan: null,
  loading: true,
  hasPlan: false,
  refreshPlan: async () => {},
});

export const usePlan = () => useContext(PlanContext);

const PENDING_KEY = "pending_plan_activation";

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlan = useCallback(async () => {
    if (!user) {
      setPlan(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Retry pending activation from localStorage
    const pending = localStorage.getItem(PENDING_KEY);
    if (pending) {
      try {
        const data = JSON.parse(pending);
        const now = new Date();
        const expiresAt = new Date(now);
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        const { error } = await (supabase.from("user_plans" as any) as any).insert({
          user_id: user.id,
          plan: data.plan,
          razorpay_order_id: data.razorpay_order_id,
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        });
        if (!error) {
          localStorage.removeItem(PENDING_KEY);
        }
      } catch (e) {
        console.error("Failed to retry pending activation:", e);
      }
    }

    // Fetch the latest active plan (not expired)
    const { data, error } = await (supabase.from("user_plans" as any) as any)
      .select("*")
      .eq("user_id", user.id)
      .gte("expires_at", new Date().toISOString())
      .order("activated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching plan:", error);
    }

    setPlan(data || null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return (
    <PlanContext.Provider value={{ plan, loading, hasPlan: !!plan, refreshPlan: fetchPlan }}>
      {children}
    </PlanContext.Provider>
  );
};
