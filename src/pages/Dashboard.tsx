import { useState, useEffect, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getTemplateById } from "@/data/templates";
import {
  LogOut, Copy, ExternalLink, Edit, Share2, Sparkles,
  Users, Download, Plus, ArrowUpRight
} from "lucide-react";
import PlanBadge from "@/components/PlanBadge";
import { usePlan } from "@/contexts/PlanContext";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Rsvp = Tables<"rsvps">;

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { hasPlan } = usePlan();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userProfile, setUserProfile] = useState<Tables<"users"> | null>(null);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRsvpTable, setShowRsvpTable] = useState(false);
  const [manualRsvpOpen, setManualRsvpOpen] = useState(false);
  const [manualRsvp, setManualRsvp] = useState({
    guest_name: "",
    guest_count: 1,
    meal_preference: "no_preference" as "veg" | "non_veg" | "jain" | "no_preference",
    note: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      setLoading(true);

      // Fetch profile
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      setUserProfile(profile);

      // Fetch latest invitation
      const { data: inv } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setInvitation(inv);

      // Fetch RSVPs if invitation exists and is published
      if (inv && inv.status === "published") {
        const { data: rsvpData } = await supabase
          .from("rsvps")
          .select("*")
          .eq("invitation_id", inv.id)
          .order("submitted_at", { ascending: false });
        setRsvps(rsvpData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, authLoading, navigate]);

  const inviteUrl = invitation?.slug
    ? `${window.location.origin}/invite/${invitation.slug}`
    : null;

  const template = invitation ? getTemplateById(invitation.template_id) : null;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const displayName = userProfile?.full_name || user?.email?.split("@")[0] || "there";

  const rsvpStats = useMemo(() => {
    const total = rsvps.reduce((sum, r) => sum + r.guest_count, 0);
    const veg = rsvps.filter(r => r.meal_preference === "veg").reduce((s, r) => s + r.guest_count, 0);
    const nonVeg = rsvps.filter(r => r.meal_preference === "non_veg").reduce((s, r) => s + r.guest_count, 0);
    const jain = rsvps.filter(r => r.meal_preference === "jain").reduce((s, r) => s + r.guest_count, 0);
    return { total, veg, nonVeg, jain, responses: rsvps.length };
  }, [rsvps]);

  const copyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      toast({ title: "Link copied!", description: "Invite link copied to clipboard" });
    }
  };

  const shareWhatsApp = () => {
    if (inviteUrl) {
      const bride = invitation?.bride_name || "Our";
      const groom = invitation?.groom_name || "";
      const text = `You're invited! 🎊 ${bride} & ${groom}'s Wedding — View our invitation: ${inviteUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const exportCSV = () => {
    const header = "Guest Name,Guest Count,Meal Preference,Note,Date Submitted\n";
    const rows = rsvps.map(r =>
      `"${r.guest_name}",${r.guest_count},"${r.meal_preference}","${r.note || ""}","${new Date(r.submitted_at).toLocaleDateString("en-IN")}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvps.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const submitManualRsvp = async () => {
    if (!invitation || !manualRsvp.guest_name.trim()) return;
    const { error } = await supabase.from("rsvps").insert({
      invitation_id: invitation.id,
      guest_name: manualRsvp.guest_name,
      guest_count: manualRsvp.guest_count,
      meal_preference: manualRsvp.meal_preference,
      note: manualRsvp.note || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "RSVP added!" });
      setManualRsvpOpen(false);
      setManualRsvp({ guest_name: "", guest_count: 1, meal_preference: "no_preference", note: "" });
      // Refresh RSVPs
      const { data } = await supabase
        .from("rsvps").select("*").eq("invitation_id", invitation.id).order("submitted_at", { ascending: false });
      setRsvps(data || []);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card px-6 md:px-16 py-4 flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-9 w-24" />
        </header>
        <main className="max-w-[900px] mx-auto py-12 px-6">
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-5 w-48 mb-10" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Dashboard — Shaadi.Digital"
        description="Manage your wedding invitation, track RSVPs, and share your invite link from your Shaadi.Digital dashboard."
        noIndex
      />
      {/* Header */}
      <header className="border-b border-border bg-card px-6 md:px-16 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-primary">
          Shaadi<span className="text-secondary">.</span>Digital
        </Link>
        <div className="flex items-center gap-4">
          <PlanBadge />
          <span className="font-body text-sm text-muted-foreground hidden md:block">
            {user?.email}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="font-body gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </Button>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto py-10 md:py-14 px-6">
        {/* Welcome Bar */}
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'hsl(var(--maroon-dark))' }}>
            Namaste, {displayName} 👋
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-1">{today}</p>
        </div>

        {/* Upgrade Prompt for free users */}
        {!hasPlan && (
          <div className="bg-[hsl(var(--callout-bg))] border border-secondary/20 p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-display text-sm font-bold" style={{ color: 'hsl(var(--maroon-dark))' }}>
                Unlock all features with a plan
              </p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">
                Publish your invite, track RSVPs, add music & more.
              </p>
            </div>
            <Link
              to="/pricing"
              className="bg-secondary text-primary-foreground px-6 py-2.5 text-[11px] font-semibold tracking-[1.5px] uppercase hover:brightness-110 transition-all shrink-0"
            >
              Choose a Plan
            </Link>
          </div>
        )}

        {/* Invite Status or Empty State */}
        {!invitation ? (
          /* Empty State */
          <div className="border-2 border-dashed border-secondary/30 bg-card p-12 md:p-16 flex flex-col items-center text-center mb-8">
            <div className="text-5xl mb-4">💌</div>
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: 'hsl(var(--maroon-dark))' }}>
              Your love story deserves a beautiful invitation
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-8 max-w-md">
              Browse our curated collection of stunning wedding templates and create your personalized digital invitation in minutes.
            </p>
            <Link
              to="/templates"
              className="bg-primary text-primary-foreground px-10 py-4 text-[13px] font-medium tracking-[1px] uppercase hover:bg-secondary transition-colors"
            >
              Browse Templates
            </Link>
          </div>
        ) : (
          <>
            {/* Invite Status Card */}
            <div className="bg-card border border-border p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Template thumbnail */}
                <div className={`w-full md:w-40 h-48 md:h-auto bg-gradient-to-br ${template?.gradient || "from-primary to-primary/80"} flex items-center justify-center shrink-0`}>
                  <div className="text-center p-4">
                    <p className="font-serif text-xs text-white/50 tracking-widest uppercase mb-1">Wedding</p>
                    <p className="font-display text-lg font-bold text-white leading-tight">
                      {invitation.bride_name || "Bride"}
                    </p>
                    <p className="font-serif text-secondary italic text-sm">&</p>
                    <p className="font-display text-lg font-bold text-white leading-tight">
                      {invitation.groom_name || "Groom"}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-display text-xl font-bold" style={{ color: 'hsl(var(--maroon-dark))' }}>
                        {invitation.bride_name || "Bride"} & {invitation.groom_name || "Groom"}
                      </h3>
                      {invitation.wedding_date && (
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {new Date(invitation.wedding_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold tracking-[1px] uppercase px-3 py-1 ${
                      invitation.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {invitation.status}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-1">
                    Template: <span className="font-medium text-foreground">{template?.name || invitation.template_id}</span>
                    {invitation.plan && <> · Plan: <span className="font-medium text-foreground capitalize">{invitation.plan}</span></>}
                  </p>

                  {/* Invite URL */}
                  {inviteUrl && invitation.status === "published" && (
                    <div className="flex items-center gap-2 mt-3 bg-background border border-border px-3 py-2">
                      <span className="text-xs text-muted-foreground truncate flex-1">{inviteUrl}</span>
                      <button onClick={copyLink} className="text-secondary hover:text-primary transition-colors shrink-0" title="Copy link">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={shareWhatsApp} className="text-[#25D366] hover:text-[#128C7E] transition-colors shrink-0" title="Share on WhatsApp">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 mt-5">
                    <Link
                      to={`/builder/${invitation.template_id}`}
                      className="flex items-center gap-1.5 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium tracking-[0.5px] uppercase hover:bg-secondary transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Invite
                    </Link>
                    {invitation.status === "published" && invitation.slug && (
                      <Link
                        to={`/invite/${invitation.slug}`}
                        className="flex items-center gap-1.5 border border-primary text-primary px-5 py-2.5 text-xs font-medium tracking-[0.5px] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Live
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RSVP Summary Card — only if published */}
            {invitation.status === "published" && (
              <div className="bg-card border border-border p-6 md:p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-lg font-bold" style={{ color: 'hsl(var(--maroon-dark))' }}>
                    <Users className="w-5 h-5 inline mr-2 text-secondary" />
                    RSVP Summary
                  </h3>
                  <div className="flex gap-2">
                    <Dialog open={manualRsvpOpen} onOpenChange={setManualRsvpOpen}>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-1 text-xs font-medium text-secondary hover:text-primary transition-colors uppercase tracking-[0.5px]">
                          <Plus className="w-3.5 h-3.5" /> Add RSVP
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-display">Add RSVP Manually</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-2">
                          <div>
                            <Label className="font-body text-sm">Guest Name *</Label>
                            <Input
                              value={manualRsvp.guest_name}
                              onChange={(e) => setManualRsvp(p => ({ ...p, guest_name: e.target.value }))}
                              placeholder="e.g. Sharma Family"
                            />
                          </div>
                          <div>
                            <Label className="font-body text-sm">Guest Count</Label>
                            <Input
                              type="number"
                              min={1}
                              value={manualRsvp.guest_count}
                              onChange={(e) => setManualRsvp(p => ({ ...p, guest_count: parseInt(e.target.value) || 1 }))}
                            />
                          </div>
                          <div>
                            <Label className="font-body text-sm">Meal Preference</Label>
                            <Select
                              value={manualRsvp.meal_preference}
                              onValueChange={(v) => setManualRsvp(p => ({ ...p, meal_preference: v as any }))}
                            >
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="veg">Veg</SelectItem>
                                <SelectItem value="non_veg">Non-Veg</SelectItem>
                                <SelectItem value="jain">Jain</SelectItem>
                                <SelectItem value="no_preference">No Preference</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="font-body text-sm">Note</Label>
                            <Textarea
                              value={manualRsvp.note}
                              onChange={(e) => setManualRsvp(p => ({ ...p, note: e.target.value }))}
                              placeholder="Optional note..."
                              rows={2}
                            />
                          </div>
                          <Button onClick={submitManualRsvp} className="w-full font-body">
                            Add RSVP
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-background border border-border p-4 text-center">
                    <div className="font-display text-3xl font-bold text-primary">{rsvpStats.total}</div>
                    <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-1">Total Guests</div>
                  </div>
                  <div className="bg-background border border-border p-4 text-center">
                    <div className="font-display text-2xl font-bold text-emerald-600">{rsvpStats.veg}</div>
                    <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-1">Veg</div>
                  </div>
                  <div className="bg-background border border-border p-4 text-center">
                    <div className="font-display text-2xl font-bold text-orange-600">{rsvpStats.nonVeg}</div>
                    <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-1">Non-Veg</div>
                  </div>
                  <div className="bg-background border border-border p-4 text-center">
                    <div className="font-display text-2xl font-bold text-secondary">{rsvpStats.jain}</div>
                    <div className="text-[11px] uppercase tracking-[1px] text-muted-foreground mt-1">Jain</div>
                  </div>
                </div>

                {/* Toggle RSVP table */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRsvpTable(!showRsvpTable)}
                    className="text-xs font-medium text-primary hover:text-secondary transition-colors uppercase tracking-[0.5px] flex items-center gap-1"
                  >
                    <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${showRsvpTable ? "rotate-90" : ""}`} />
                    {showRsvpTable ? "Hide" : "View All"} RSVPs ({rsvpStats.responses})
                  </button>
                  {rsvps.length > 0 && (
                    <button
                      onClick={exportCSV}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.5px] flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  )}
                </div>

                {/* RSVP Table */}
                {showRsvpTable && (
                  <div className="mt-4 border border-border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted text-left">
                          <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">Guest Name</th>
                          <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">Count</th>
                          <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">Meal</th>
                          <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">Note</th>
                          <th className="px-4 py-3 font-medium text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rsvps.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                              No RSVPs yet. Share your invite link to start receiving responses!
                            </td>
                          </tr>
                        ) : (
                          rsvps.map((r) => (
                            <tr key={r.id} className="border-t border-border hover:bg-muted/50">
                              <td className="px-4 py-3 font-medium">{r.guest_name}</td>
                              <td className="px-4 py-3">{r.guest_count}</td>
                              <td className="px-4 py-3 capitalize">{r.meal_preference.replace("_", " ")}</td>
                              <td className="px-4 py-3 text-muted-foreground">{r.note || "—"}</td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {new Date(r.submitted_at).toLocaleDateString("en-IN")}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={shareWhatsApp}
                className="bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-secondary transition-colors group"
              >
                <Share2 className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Share WhatsApp</span>
              </button>
              <button
                onClick={copyLink}
                className="bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-secondary transition-colors group"
              >
                <Copy className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Copy Link</span>
              </button>
              <Link
                to={`/builder/${invitation.template_id}`}
                className="bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-secondary transition-colors group"
              >
                <Edit className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Edit Invite</span>
              </Link>
              {(!invitation.plan || invitation.plan === "basic") && (
                <button
                  onClick={() => toast({ title: "Coming soon!", description: "Plan upgrades will be available shortly." })}
                  className="bg-card border border-border p-4 flex flex-col items-center gap-2 hover:border-secondary transition-colors group"
                >
                  <Sparkles className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-foreground">Upgrade Plan</span>
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
