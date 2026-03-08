import { useState, useEffect, useRef, useCallback } from "react";
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
  Users, Download, Plus, ArrowUpRight, Eye, Heart, Calendar, MessageSquare, Check, Mail
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getWhatsAppMessage, getEmailSubject, getEmailBody } from "@/lib/share-messages";
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
  const [dashboardTab, setDashboardTab] = useState<"overview" | "guests" | "blessings" | "share">("overview");
  const [manualRsvpOpen, setManualRsvpOpen] = useState(false);
  const [nudgeDialogOpen, setNudgeDialogOpen] = useState(false);
  const [customSlug, setCustomSlug] = useState("");
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugError, setSlugError] = "";
  const [shareMessage, setShareMessage] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
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
      if (inv?.slug) setCustomSlug(inv.slug);
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


  const copyLink = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      toast({ title: "Link copied!", description: "Invite link copied to clipboard" });
    }
  };

  const sanitizeSlug = (val: string) =>
    val.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  const saveCustomSlug = async () => {
    if (!invitation) return;
    const slug = sanitizeSlug(customSlug);
    if (!slug || slug.length < 3) {
      setSlugError("Slug must be at least 3 characters");
      return;
    }
    setSlugSaving(true);
    setSlugError("");

    // Check uniqueness
    const { data: existing } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", slug)
      .neq("id", invitation.id)
      .maybeSingle();

    if (existing) {
      setSlugError("This link is already taken. Try another one!");
      setSlugSaving(false);
      return;
    }

    const { error } = await supabase
      .from("invitations")
      .update({ slug })
      .eq("id", invitation.id);

    if (error) {
      setSlugError(error.message);
    } else {
      setInvitation((prev) => prev ? { ...prev, slug } : prev);
      setCustomSlug(slug);
      toast({ title: "✓ Custom link saved!", description: `Your invite is now at /invite/${slug}` });
    }
    setSlugSaving(false);
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

            {/* ───────── RSVP Dashboard ───────── */}
            {invitation.status === "published" && (
              <motion.div
                initial="hidden" animate="visible" variants={fadeUp} custom={4}
                className="bg-card border border-border/50 overflow-hidden rounded-2xl"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

                {/* Tab Navigation */}
                <div className="flex items-center border-b border-border/60 px-6 overflow-x-auto no-scrollbar">
                  {([
                    { key: "overview" as const, label: "📊 Overview" },
                    { key: "guests" as const, label: "👥 Guest List" },
                    { key: "blessings" as const, label: "💌 Blessings" },
                    { key: "share" as const, label: "📤 Share Invite" },
                  ]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setDashboardTab(tab.key)}
                      className={`px-4 py-3.5 font-body text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                        dashboardTab === tab.key
                          ? "text-primary border-primary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  {/* Add RSVP button */}
                  <div className="ml-auto pl-4 py-2">
                    <Dialog open={manualRsvpOpen} onOpenChange={setManualRsvpOpen}>
                      <DialogTrigger asChild>
                        <button className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-secondary hover:text-primary transition-colors uppercase tracking-[1px] border border-secondary/30 px-3 py-1.5 rounded-full hover:border-primary/30">
                          <Plus className="w-3 h-3" /> Add RSVP
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
                            <Label className="font-body text-sm">Note / Blessing</Label>
                            <Textarea
                              value={manualRsvp.note}
                              onChange={(e) => setManualRsvp(p => ({ ...p, note: e.target.value }))}
                              placeholder="Optional note..." rows={2}
                            />
                          </div>
                          <Button onClick={submitManualRsvp} className="w-full font-body rounded-none">Add RSVP</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Empty state for 0 RSVPs */}
                  {rsvps.length === 0 && dashboardTab !== "share" ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="text-5xl mb-5"
                      >
                        💌
                      </motion.div>
                      <h3 className="font-display text-2xl font-bold text-primary mb-2">
                        Your RSVP dashboard is ready!
                      </h3>
                      <p className="font-body text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
                        Share your invitation link to start collecting responses. Guest confirmations will appear here in real time.
                      </p>
                      <button
                        onClick={() => setDashboardTab("share")}
                        className="bg-primary text-primary-foreground px-8 py-3 text-[11px] font-semibold tracking-[2px] uppercase hover:bg-primary/90 transition-all shadow-md rounded-none"
                      >
                        📤 Share Your Invite →
                      </button>
                      <div className="mt-8 pt-6 border-t border-border/50 max-w-sm">
                        <p className="font-body text-xs text-muted-foreground leading-relaxed">
                          💡 <strong>Tip:</strong> Share to your family WhatsApp groups first — they respond fastest and others follow.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* OVERVIEW TAB */}
                      {dashboardTab === "overview" && (
                        <div>
                          <RsvpStatCards rsvps={rsvps} />
                          <DietaryCard
                            rsvps={rsvps}
                            brideName={invitation.bride_name || undefined}
                            groomName={invitation.groom_name || undefined}
                          />
                        </div>
                      )}

                      {/* GUEST LIST TAB */}
                      {dashboardTab === "guests" && (
                        <GuestListTab
                          rsvps={rsvps}
                          onExportCSV={exportCSV}
                        />
                      )}

                      {/* BLESSINGS TAB */}
                      {dashboardTab === "blessings" && (
                        <BlessingsTab rsvps={rsvps} />
                      )}

                      {/* SHARE TAB */}
                      {dashboardTab === "share" && (
                        <div className="space-y-6">
                          {/* Custom Link Editor */}
                          <div className="border border-secondary/20 bg-[hsl(var(--callout))] p-5 rounded-xl">
                            <h4 className="font-display text-base font-semibold text-foreground mb-1">✨ Create Your Custom Link</h4>
                            <p className="font-body text-xs text-muted-foreground mb-4">
                              Make it personal — choose a memorable link for your invitation
                            </p>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <div className="flex items-center gap-0 flex-1 min-w-0 border border-border bg-background rounded-lg overflow-hidden">
                                <span className="font-body text-xs text-muted-foreground bg-muted/60 px-3 py-2.5 shrink-0 border-r border-border">
                                  shaadi.digital/invite/
                                </span>
                                <Input
                                  value={customSlug}
                                  onChange={(e) => {
                                    setCustomSlug(e.target.value);
                                    setSlugError("");
                                  }}
                                  placeholder="areeb-rida"
                                  className="border-0 rounded-none h-auto py-2.5 text-sm font-body focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                              </div>
                              <Button
                                onClick={saveCustomSlug}
                                disabled={slugSaving || sanitizeSlug(customSlug) === invitation?.slug}
                                className="bg-primary text-primary-foreground rounded-none font-body text-xs tracking-wider h-10 px-6 shrink-0"
                              >
                                {slugSaving ? "Saving…" : sanitizeSlug(customSlug) === invitation?.slug ? "✓ Saved" : "Save Link"}
                              </Button>
                            </div>
                            {slugError && (
                              <p className="font-body text-xs text-destructive mt-2">{slugError}</p>
                            )}
                            <p className="font-body text-[11px] text-muted-foreground mt-2">
                              💡 Use lowercase letters, numbers and hyphens only. e.g. <strong>priya-arjun</strong>, <strong>sharma-wedding</strong>
                            </p>
                          </div>

                          {inviteUrl && (
                            <div>
                              <h4 className="font-display text-base font-semibold text-foreground mb-3">Your Invite Link</h4>
                              <div className="flex items-center gap-2 bg-muted/50 border border-border/60 px-4 py-3 rounded-xl">
                                <span className="text-xs text-muted-foreground truncate flex-1 font-body">{inviteUrl}</span>
                                <button onClick={copyLink} className="text-secondary hover:text-primary transition-colors shrink-0 p-1" title="Copy link">
                                  <Copy className="w-4 h-4" />
                                </button>
                                <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary transition-colors shrink-0 p-1" title="Open invite">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              onClick={shareWhatsApp}
                              className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-xl hover:bg-[#25D366]/20 transition-colors"
                            >
                              <Share2 className="w-5 h-5 text-[#25D366]" />
                              <div className="text-left">
                                <p className="font-body text-sm font-medium text-foreground">Share on WhatsApp</p>
                                <p className="font-body text-xs text-muted-foreground">Send to family & friends</p>
                              </div>
                            </button>
                            <button
                              onClick={copyLink}
                              className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/30 rounded-xl hover:bg-secondary/20 transition-colors"
                            >
                              <Copy className="w-5 h-5 text-secondary" />
                              <div className="text-left">
                                <p className="font-body text-sm font-medium text-foreground">Copy Link</p>
                                <p className="font-body text-xs text-muted-foreground">Paste anywhere</p>
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Nudge Reminder Dialog */}
            <Dialog open={nudgeDialogOpen} onOpenChange={setNudgeDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Send Reminder?</DialogTitle>
                  <DialogDescription className="font-body text-sm">
                    This will send a WhatsApp reminder to guests who haven't responded yet.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-3 sm:justify-end">
                  <Button variant="outline" onClick={() => setNudgeDialogOpen(false)} className="rounded-none font-body">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setNudgeDialogOpen(false);
                      toast({ title: "Reminders queued!", description: "We'll send gentle nudges to your pending guests." });
                    }}
                    className="bg-primary text-primary-foreground rounded-none font-body"
                  >
                    Send Reminder →
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
