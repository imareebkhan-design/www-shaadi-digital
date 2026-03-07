import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type PlanName = "shubh" | "shaadi" | "shaahi";

interface UserPlan {
  plan_name: PlanName;
  plan_amount: number;
  payment_id: string | null;
  activated_at: string;
  is_active: boolean;
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
        const { error } = await (supabase.from("user_plans" as any) as any).upsert(
          {
            user_id: user.id,
            plan_name: data.plan_name,
            plan_amount: data.plan_amount,
            payment_id: data.payment_id,
            activated_at: new Date().toISOString(),
            is_active: true,
          },
          { onConflict: "user_id" }
        );
        if (!error) {
          localStorage.removeItem(PENDING_KEY);
        }
      } catch (e) {
        console.error("Failed to retry pending activation:", e);
      }
    }

    const { data, error } = await (supabase.from("user_plans" as any) as any)
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
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
