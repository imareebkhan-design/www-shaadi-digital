import { useState, useEffect, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getTemplateById } from "@/data/templates";
import {
  LogOut, Copy, ExternalLink, Edit, Share2, Sparkles,
  Users, Download, Plus, ArrowUpRight, Eye, Heart, Calendar, MessageSquare
} from "lucide-react";
import PlanBadge from "@/components/PlanBadge";
import { usePlan } from "@/contexts/PlanContext";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";
import RsvpStatCards from "@/components/dashboard/RsvpStatCards";
import NudgeBanner from "@/components/dashboard/NudgeBanner";
import DietaryCard from "@/components/dashboard/DietaryCard";
import GuestListTab from "@/components/dashboard/GuestListTab";
import BlessingsTab from "@/components/dashboard/BlessingsTab";

type Invitation = Tables<"invitations">;
type Rsvp = Tables<"rsvps">;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

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
      const { data: profile } = await supabase
        .from("users").select("*").eq("auth_user_id", user.id).maybeSingle();
      setUserProfile(profile);

      const { data: inv } = await supabase
        .from("invitations").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(1).maybeSingle();
      setInvitation(inv);

      if (inv && inv.status === "published") {
        const { data: rsvpData } = await supabase
          .from("rsvps").select("*").eq("invitation_id", inv.id)
          .order("submitted_at", { ascending: false });
        setRsvps(rsvpData || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const inviteUrl = invitation?.slug
    ? `${window.location.origin}/invite/${invitation.slug}` : null;
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
    a.href = url; a.download = "rsvps.csv"; a.click();
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
      const { data } = await supabase
        .from("rsvps").select("*").eq("invitation_id", invitation.id).order("submitted_at", { ascending: false });
      setRsvps(data || []);
    }
  };

  const weddingDate = invitation?.wedding_date ? new Date(invitation.wedding_date) : null;
  const daysUntilWedding = weddingDate
    ? Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  // --- Loading Skeleton ---
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card px-6 md:px-16 py-4 flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-9 w-24" />
        </header>
        <main className="max-w-[1000px] mx-auto py-12 px-6">
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-5 w-48 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" />
          </div>
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

      {/* ───────── Header ───────── */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-16 py-3.5 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-primary">
          Shaadi<span className="text-secondary">.</span>Digital
        </Link>
        <div className="flex items-center gap-3">
          <PlanBadge />
          <span className="font-body text-xs text-muted-foreground hidden md:block">
            {user?.email}
          </span>
          <Button variant="outline" size="sm" onClick={signOut} className="font-body gap-1.5 text-xs">
            <LogOut className="w-3.5 h-3.5" /> Log out
          </Button>
        </div>
      </header>

      {/* ───────── Hero Banner ───────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-royal)" }}
      >
        {/* Ornamental pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9941A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-[1000px] mx-auto px-6 py-10 md:py-14">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <p className="font-body text-[11px] uppercase tracking-[2px] text-primary-foreground/50 mb-2">{today}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground leading-tight">
              Namaste, {displayName} 👋
            </h1>
            {weddingDate && daysUntilWedding !== null && daysUntilWedding > 0 && (
              <p className="font-body text-sm text-primary-foreground/60 mt-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="text-secondary font-semibold">{daysUntilWedding} days</span> until the big day
              </p>
            )}
          </motion.div>
        </div>
        {/* Gold accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
      </div>

      <main className="max-w-[1000px] mx-auto py-8 md:py-12 px-6">
        {/* ───────── Upgrade Banner ───────── */}
        {!hasPlan && (
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="relative overflow-hidden mb-8 p-6 md:p-8"
            style={{ background: "var(--gradient-gold)" }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2l2 3.5-2 3z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <p className="font-display text-lg font-bold text-primary">
                    Unlock Your Premium Wedding Suite
                  </p>
                </div>
                <p className="font-body text-sm text-primary/70">
                  Publish your invite, track RSVPs, add music, gallery & more.
                </p>
              </div>
              <Link
                to="/pricing"
                className="bg-primary text-primary-foreground px-8 py-3 text-[11px] font-semibold tracking-[2px] uppercase hover:bg-primary/90 transition-all shrink-0 shadow-lg"
              >
                View Plans
              </Link>
            </div>
          </motion.div>
        )}

        {/* ───────── Empty State ───────── */}
        {!invitation ? (
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="relative overflow-hidden border border-secondary/20 bg-card p-12 md:p-20 flex flex-col items-center text-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-6xl mb-6"
            >
              💌
            </motion.div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-3">
              Your love story deserves a beautiful invitation
            </h3>
            <p className="font-body text-sm text-muted-foreground mb-10 max-w-md leading-relaxed">
              Browse our curated collection of stunning wedding templates and create your personalized digital invitation in minutes.
            </p>
            <Link
              to="/templates"
              className="bg-primary text-primary-foreground px-12 py-4 text-[13px] font-medium tracking-[1.5px] uppercase hover:bg-secondary transition-colors shadow-lg"
            >
              Browse Templates
            </Link>
          </motion.div>
        ) : (
          <>
            {/* ───────── Invitation Card (Premium) ───────── */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="relative overflow-hidden bg-card border border-border/50 mb-8"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              {/* Top gold accent */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

              <div className="flex flex-col md:flex-row">
                {/* Template Preview */}
                <div
                  className={`relative w-full md:w-56 h-56 md:h-auto bg-gradient-to-br ${template?.gradient || "from-primary to-primary/80"} flex items-center justify-center shrink-0 overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 30% 20%, hsl(var(--secondary) / 0.4) 0%, transparent 50%)`,
                  }} />
                  <div className="text-center p-6 relative z-10">
                    <p className="font-body text-[9px] text-white/40 tracking-[3px] uppercase mb-3">Wedding</p>
                    <p className="font-display text-2xl font-bold text-white leading-tight">
                      {invitation.bride_name || "Bride"}
                    </p>
                    <div className="my-2 flex items-center justify-center gap-2">
                      <div className="w-6 h-px bg-secondary/60" />
                      <Heart className="w-3 h-3 text-secondary" />
                      <div className="w-6 h-px bg-secondary/60" />
                    </div>
                    <p className="font-display text-2xl font-bold text-white leading-tight">
                      {invitation.groom_name || "Groom"}
                    </p>
                    {weddingDate && (
                      <p className="font-body text-[10px] text-white/50 mt-3 tracking-wider">
                        {weddingDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-xl md:text-2xl font-bold text-primary">
                        {invitation.bride_name || "Bride"} & {invitation.groom_name || "Groom"}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        Template: <span className="text-foreground font-medium">{template?.name || invitation.template_id}</span>
                        {invitation.plan && <> · <span className="capitalize text-foreground font-medium">{invitation.plan}</span> plan</>}
                      </p>
                    </div>
                    <span className={`shrink-0 text-[9px] font-bold tracking-[1.5px] uppercase px-3 py-1.5 ${
                      invitation.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {invitation.status === "published" ? "● Live" : "Draft"}
                    </span>
                  </div>

                  {/* Invite URL */}
                  {inviteUrl && invitation.status === "published" && (
                    <div className="flex items-center gap-2 bg-muted/50 border border-border/60 px-4 py-2.5 mb-5">
                      <span className="text-xs text-muted-foreground truncate flex-1 font-body">{inviteUrl}</span>
                      <button onClick={copyLink} className="text-secondary hover:text-primary transition-colors shrink-0 p-1" title="Copy link">
                        <Copy className="w-4 h-4" />
                      </button>
                      <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors shrink-0 p-1" title="Open invite">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/builder/${invitation.template_id}`}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-[11px] font-semibold tracking-[1.5px] uppercase hover:bg-primary/90 transition-all shadow-md"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Invite
                    </Link>
                    {invitation.status === "published" && invitation.slug && (
                      <Link
                        to={`/invite/${invitation.slug}`}
                        className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 text-[11px] font-semibold tracking-[1.5px] uppercase hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Live
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ───────── Quick Actions Grid ───────── */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
            >
              {[
                { icon: Share2, label: "Share on WhatsApp", color: "text-[#25D366]", onClick: shareWhatsApp },
                { icon: Copy, label: "Copy Invite Link", color: "text-secondary", onClick: copyLink },
                { icon: Edit, label: "Edit Invitation", color: "text-primary", onClick: () => navigate(`/builder/${invitation.template_id}`) },
                { icon: Sparkles, label: hasPlan ? "Manage Plan" : "Upgrade Plan", color: "text-secondary", onClick: () => hasPlan ? toast({ title: "Plan active!", description: "Your plan is currently active." }) : navigate("/pricing") },
              ].map(({ icon: Icon, label, color, onClick }, i) => (
                <motion.button
                  key={label}
                  whileHover={{ y: -4, boxShadow: "var(--shadow-card)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClick}
                  className="bg-card border border-border/60 p-5 flex flex-col items-center gap-3 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-body font-medium text-foreground tracking-wide">{label}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* ───────── RSVP Section ───────── */}
            {invitation.status === "published" && (
              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} custom={4}
                className="bg-card border border-border/50 overflow-hidden"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

                <div className="p-6 md:p-8">
                  {/* RSVP Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-primary">RSVP Responses</h3>
                        <p className="font-body text-xs text-muted-foreground">{rsvpStats.responses} responses received</p>
                      </div>
                    </div>
                    <Dialog open={manualRsvpOpen} onOpenChange={setManualRsvpOpen}>
                      <DialogTrigger asChild>
                        <button className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-secondary hover:text-primary transition-colors uppercase tracking-[1px] border border-secondary/30 px-3 py-1.5 hover:border-primary/30">
                          <Plus className="w-3 h-3" /> Add
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
                              type="number" min={1}
                              value={manualRsvp.guest_count}
                              onChange={(e) => setManualRsvp(p => ({ ...p, guest_count: parseInt(e.target.value) || 1 }))}
                            />
                          </div>
                          <div>
                            <Label className="font-body text-sm">Meal Preference</Label>
                            <Select value={manualRsvp.meal_preference} onValueChange={(v) => setManualRsvp(p => ({ ...p, meal_preference: v as any }))}>
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
                              placeholder="Optional note..." rows={2}
                            />
                          </div>
                          <Button onClick={submitManualRsvp} className="w-full font-body">Add RSVP</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: "Total Guests", value: rsvpStats.total, color: "text-primary", bg: "bg-primary/5", icon: Users },
                      { label: "Vegetarian", value: rsvpStats.veg, color: "text-emerald-600", bg: "bg-emerald-50", icon: Heart },
                      { label: "Non-Veg", value: rsvpStats.nonVeg, color: "text-orange-600", bg: "bg-orange-50", icon: Heart },
                      { label: "Jain", value: rsvpStats.jain, color: "text-secondary", bg: "bg-callout", icon: Heart },
                    ].map(({ label, value, color, bg, icon: StatIcon }) => (
                      <div key={label} className={`${bg} p-4 text-center border border-border/30`}>
                        <div className={`font-display text-3xl font-bold ${color}`}>{value}</div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <div className="text-[10px] uppercase tracking-[1px] text-muted-foreground font-body">{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Toggle & Export */}
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => setShowRsvpTable(!showRsvpTable)}
                      className="text-[11px] font-semibold text-primary hover:text-secondary transition-colors uppercase tracking-[1px] flex items-center gap-1.5"
                    >
                      <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${showRsvpTable ? "rotate-90" : ""}`} />
                      {showRsvpTable ? "Hide" : "View"} All ({rsvpStats.responses})
                    </button>
                    {rsvps.length > 0 && (
                      <button
                        onClick={exportCSV}
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[1px] flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Export CSV
                      </button>
                    )}
                  </div>

                  {/* RSVP Table */}
                  {showRsvpTable && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-5 border border-border/60 overflow-x-auto"
                    >
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted/60">
                            <th className="px-4 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">Guest</th>
                            <th className="px-4 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">Count</th>
                            <th className="px-4 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">Meal</th>
                            <th className="px-4 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">Note</th>
                            <th className="px-4 py-3 font-body font-semibold text-[10px] uppercase tracking-wider text-muted-foreground text-left">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rsvps.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground font-body text-sm">
                                <MessageSquare className="w-5 h-5 mx-auto mb-2 text-secondary/50" />
                                No RSVPs yet. Share your invite to start receiving responses!
                              </td>
                            </tr>
                          ) : (
                            rsvps.map((r) => (
                              <tr key={r.id} className="border-t border-border/40 hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-body font-medium text-foreground">{r.guest_name}</td>
                                <td className="px-4 py-3 font-body">{r.guest_count}</td>
                                <td className="px-4 py-3 font-body capitalize">{r.meal_preference.replace("_", " ")}</td>
                                <td className="px-4 py-3 font-body text-muted-foreground">{r.note || "—"}</td>
                                <td className="px-4 py-3 font-body text-muted-foreground text-xs">
                                  {new Date(r.submitted_at).toLocaleDateString("en-IN")}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
