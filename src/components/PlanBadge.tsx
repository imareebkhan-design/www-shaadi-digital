import { Link } from "react-router-dom";
import { usePlan } from "@/contexts/PlanContext";
import { Sparkles } from "lucide-react";

const PLAN_LABELS: Record<string, { label: string; extra?: string }> = {
  shubh: { label: "Shubh Plan ✓" },
  shaadi: { label: "Shaadi Plan ✓" },
  shaahi: { label: "Shaahi Plan ✓", extra: "Premium" },
};

const PlanBadge = () => {
  const { plan, hasPlan, loading } = usePlan();

  if (loading) return null;

  if (!hasPlan) {
    return (
      <Link
        to="/pricing"
        className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground px-3 py-1.5 text-[10px] font-semibold tracking-[1px] uppercase hover:bg-secondary/10 transition-colors"
      >
        Free Plan
        <span className="text-secondary ml-1 flex items-center gap-0.5">
          <Sparkles className="w-3 h-3" /> Upgrade
        </span>
      </Link>
    );
  }

  const info = PLAN_LABELS[plan!.plan_name] || { label: plan!.plan_name };

  return (
    <div className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 text-[10px] font-semibold tracking-[1px] uppercase border border-secondary/20">
      {info.label}
      {info.extra && (
        <span className="bg-secondary text-primary-foreground px-1.5 py-0.5 text-[8px] tracking-[1px]">
          {info.extra}
        </span>
      )}
    </div>
  );
};

export default PlanBadge;
