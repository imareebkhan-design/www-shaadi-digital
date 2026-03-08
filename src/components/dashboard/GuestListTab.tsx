import { useState, useMemo } from "react";
import type { Tables } from "@/integrations/supabase/types";
import { Search, MessageSquare, MoreVertical, Download, Trash2, CheckCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

type Rsvp = Tables<"rsvps">;

interface GuestListTabProps {
  rsvps: Rsvp[];
  onExportCSV: () => void;
  onRemoveGuest?: (id: string) => void;
}

const MEAL_LABELS: Record<string, string> = {
  veg: "🥦 Veg",
  non_veg: "🍗 Non-Veg",
  jain: "🌿 Jain",
  no_preference: "—",
};

const GuestListTab = ({ rsvps, onExportCSV, onRemoveGuest }: GuestListTabProps) => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // All RSVPs are "confirmed" in current schema
  const filtered = useMemo(() => {
    let list = rsvps;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.guest_name.toLowerCase().includes(q));
    }
    return list;
  }, [rsvps, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  };

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guests by name..."
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors font-body"
        />
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-primary/5 border border-primary/20"
          >
            <span className="font-body text-sm font-medium text-primary">
              {selectedIds.size} selected
            </span>
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-1 text-[11px] font-body font-medium text-muted-foreground hover:text-foreground uppercase tracking-[0.5px]"
            >
              <Download className="w-3 h-3" /> Export
            </button>
            {onRemoveGuest && (
              <button
                onClick={() => {
                  selectedIds.forEach((id) => onRemoveGuest(id));
                  setSelectedIds(new Set());
                }}
                className="inline-flex items-center gap-1 text-[11px] font-body font-medium text-destructive uppercase tracking-[0.5px]"
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="border border-border/60 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40">
              <th className="px-3 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={toggleAll}
                  className="accent-primary w-3.5 h-3.5"
                />
              </th>
              <th className="px-3 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">
                Guest
              </th>
              <th className="px-3 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">
                Guests
              </th>
              <th className="px-3 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">
                Dietary
              </th>
              <th className="px-3 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">
                Message
              </th>
              <th className="px-3 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">
                Date
              </th>
              <th className="px-3 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground font-body text-sm">
                  <MessageSquare className="w-5 h-5 mx-auto mb-2 text-secondary/50" />
                  {search ? "No guests match your search" : "No RSVPs yet. Share your invite to start!"}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-border/40 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="accent-primary w-3.5 h-3.5"
                    />
                  </td>
                  <td className="px-3 py-3 font-body font-medium text-foreground">
                    {r.guest_name}
                  </td>
                  <td className="px-3 py-3 font-body text-muted-foreground">
                    {r.guest_count} {r.guest_count > 1 ? "guests" : "guest"}
                  </td>
                  <td className="px-3 py-3 font-body text-sm">
                    {MEAL_LABELS[r.meal_preference] || r.meal_preference}
                  </td>
                  <td className="px-3 py-3">
                    {r.note ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="text-secondary hover:text-primary transition-colors" title="View message">
                            💌
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="max-w-xs text-sm font-body">
                          <p className="font-serif italic text-foreground">"{r.note}"</p>
                          <p className="text-xs text-muted-foreground mt-2">— {r.guest_name}</p>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-body text-muted-foreground text-xs">
                    {new Date(r.submitted_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-3 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-muted rounded transition-colors">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="font-body text-xs gap-2">
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Confirmed
                        </DropdownMenuItem>
                        {onRemoveGuest && (
                          <DropdownMenuItem
                            className="font-body text-xs gap-2 text-destructive"
                            onClick={() => onRemoveGuest(r.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="font-body text-xs text-muted-foreground">
          Showing {filtered.length} of {rsvps.length} guests
        </p>
        {rsvps.length > 0 && (
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 text-[11px] font-body font-medium text-muted-foreground hover:text-foreground uppercase tracking-[1px]"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </div>
    </div>
  );
};

export default GuestListTab;
