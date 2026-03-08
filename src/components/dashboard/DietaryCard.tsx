import { useMemo } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { Download } from "lucide-react";

type Rsvp = Tables<"rsvps">;

interface DietaryCardProps {
  rsvps: Rsvp[];
  brideName?: string;
  groomName?: string;
}

const MEAL_LABELS: Record<string, string> = {
  veg: "Vegetarian",
  non_veg: "Non-Veg",
  jain: "Jain",
  no_preference: "No Preference",
};

const MEAL_COLORS: Record<string, string> = {
  veg: "#22c55e",
  non_veg: "#f97316",
  jain: "#eab308",
  no_preference: "#94a3b8",
};

const DietaryCard = ({ rsvps, brideName, groomName }: DietaryCardProps) => {
  const dietData = useMemo(() => {
    const counts: Record<string, number> = { veg: 0, non_veg: 0, jain: 0, no_preference: 0 };
    rsvps.forEach((r) => {
      counts[r.meal_preference] = (counts[r.meal_preference] || 0) + r.guest_count;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([key, count]) => ({
      key,
      label: MEAL_LABELS[key] || key,
      count,
      pct: total > 0 ? (count / total) * 100 : 0,
      color: MEAL_COLORS[key] || "#94a3b8",
    }));
  }, [rsvps]);

  const total = dietData.reduce((s, d) => s + d.count, 0);

  const exportCSV = () => {
    const header = "Guest Name,Guest Count,Dietary Preference,Message,Date Submitted\n";
    const rows = rsvps
      .map(
        (r) =>
          `"${r.guest_name}",${r.guest_count},"${MEAL_LABELS[r.meal_preference] || r.meal_preference}","${(r.note || "").replace(/"/g, '""')}","${new Date(r.submitted_at).toLocaleDateString("en-IN")}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = [brideName, groomName].filter(Boolean).join("-").toLowerCase().replace(/\s+/g, "-") || "guest-list";
    a.href = url;
    a.download = `${slug}-guest-list.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border rounded-2xl p-5 md:p-6 mb-6" style={{ borderColor: "#ede8e3" }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
          🍽️ Dietary Requirements
        </h4>
        {total > 0 && (
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 text-[11px] font-body font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[1px]"
          >
            <Download className="w-3.5 h-3.5" /> Export for caterer
          </button>
        )}
      </div>

      {total === 0 ? (
        <p className="font-body text-sm text-muted-foreground py-4 text-center">
          Dietary preferences will appear here as guests RSVP 🙏
        </p>
      ) : (
        <div className="space-y-3">
          {dietData.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="font-body text-sm w-28 shrink-0" style={{ color: "#3d2014" }}>
                {d.label}
              </span>
              <div className="flex-1 h-2.5 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                />
              </div>
              <span className="font-body text-sm font-medium text-foreground w-8 text-right">
                {d.count}
              </span>
              <span className="font-body text-[11px] text-muted-foreground w-10 text-right">
                ({d.pct.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DietaryCard;
