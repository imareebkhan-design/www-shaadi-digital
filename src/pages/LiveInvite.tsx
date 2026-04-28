import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { TEMPLATE_REGISTRY } from "@/templates";
import type { InvitationData } from "@/templates/types";
import { invitationDataToConfig } from "@/templates/types";
import { WeddingTemplate } from "@/templates/WeddingTemplate";
import RsvpForm from "@/components/invite/RsvpForm";
import { normalizeSlug } from "@/lib/slugUtils";
import type { Tables } from "@/integrations/supabase/types";

type InvitationRow = Tables["invitations"]["Row"];
type EventRow = Tables["events"]["Row"];

const LiveInvite = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [rawInvitation, setRawInvitation] = useState<InvitationRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    const fetchData = async () => {
      const normalizedSlug = normalizeSlug(slug);
      const { data: inv } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", normalizedSlug)
        .eq("status", "published")
        .maybeSingle() as { data: InvitationRow | null };

      if (!inv) { setNotFound(true); setLoading(false); return; }
      setInvitationId(inv.id);
      setTemplateId(inv.template_id);
      setRawInvitation(inv);

      const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("invitation_id", inv.id)
        .order("event_date", { ascending: true }) as { data: EventRow[] | null };

      const data: InvitationData = {
        bride_name: inv.bride_name || "Bride",
        groom_name: inv.groom_name || "Groom",
        bride_family: inv.bride_family || "",
        groom_family: inv.groom_family || "",
        bride_full_name: inv.bride_full_name || undefined,
        groom_full_name: inv.groom_full_name || undefined,
        bride_bio: inv.bride_bio || undefined,
        groom_bio: inv.groom_bio || undefined,
        personal_message: inv.personal_message || undefined,
        our_story: inv.our_story || undefined,
        wedding_date: inv.wedding_date || "",
        wedding_city: inv.wedding_city || undefined,
        photo_url: inv.photo_url || undefined,
        gallery_photos: (inv.gallery_photos as string[]) || [],
        language: inv.language || "english",
        upi_id: inv.upi_id || undefined,
        gift_registry_url: inv.gift_registry_url || undefined,
        dresscode_enabled: inv.dresscode_enabled || false,
        dresscode_text: inv.dresscode_text || undefined,
        dresscode_colors: (inv.dresscode_colors as string[]) || [],
        music_url: inv.music_url || undefined,
        venue_description: inv.venue_description || undefined,
        venue_photo: inv.venue_photo || undefined,
        rsvp_deadline: inv.rsvp_deadline || undefined,
        hero_media_type: inv.hero_media_type || undefined,
        hero_media_url: inv.hero_media_url || undefined,
        events: (events || []).map((e) => ({
          event_type: e.event_type,
          event_name: e.event_name,
          event_date: e.event_date || "",
          event_time: e.event_time || "",
          venue_name: e.venue_name || "",
          venue_address: e.venue_address || "",
          maps_url: e.maps_url || undefined,
          is_enabled: e.is_enabled,
          tagline: e.tagline || undefined,
          description: e.description || undefined,
          event_photo: e.event_photo || undefined,
        })),
      };

      setInvitationData(data);
      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0f0f0f" }}>
        <h1 className="font-display text-2xl text-white mb-1">
          Shaadi<span className="text-secondary">.</span>Digital
        </h1>
        <p className="font-serif italic text-white/40 text-sm mb-8">Aapki Shaadi, Aapka Andaaz</p>
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !invitationData || !templateId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-6">💔</div>
        <h1 className="font-display text-3xl font-bold mb-3" style={{ color: "hsl(var(--maroon-dark))" }}>
          Invitation Not Found
        </h1>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          This invitation is no longer available. It may have been removed or the link may be incorrect.
        </p>
        <a href="/" className="mt-8 text-sm text-secondary hover:text-primary transition-colors underline underline-offset-4">
          Go to Shaadi.Digital
        </a>
      </div>
    );
  }

  const templateEntry = TEMPLATE_REGISTRY[templateId];
  if (!templateEntry) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-6">⚠️</div>
        <h1 className="font-display text-2xl font-bold mb-3" style={{ color: "hsl(var(--maroon-dark))" }}>
          Template Unavailable
        </h1>
        <p className="text-muted-foreground">This invitation's design is currently unavailable.</p>
        <a href="/" className="mt-6 text-sm text-secondary hover:text-primary transition-colors underline underline-offset-4">
          Go to Shaadi.Digital
        </a>
      </div>
    );
  }

  const config = invitationDataToConfig(invitationData);
  const brideName = config.couple.brideName;
  const groomName = config.couple.groomName;

  // Dynamic OG data
  const formattedDate = rawInvitation?.wedding_date
    ? new Date(rawInvitation.wedding_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";
  const city = rawInvitation?.wedding_city || "";
  const ogTitle = `${brideName} & ${groomName} — You're Invited ✨`;
  const ogDescription = formattedDate && city
    ? `Join us for our wedding celebration on ${formattedDate} in ${city}. Tap to open your invitation.`
    : `You're invited to ${brideName} & ${groomName}'s wedding celebration. View details and RSVP.`;

  const canonicalSlug = rawInvitation?.slug || (slug ? normalizeSlug(slug) : "");
  const updatedAt = rawInvitation?.updated_at ? new Date(rawInvitation.updated_at).getTime() : "";
  const ogImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-og-image?slug=${canonicalSlug}${updatedAt ? `&v=${updatedAt}` : ""}`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={ogTitle}
        description={ogDescription}
        canonical={`https://shaadi.digital/invite/${canonicalSlug}`}
        ogImage={ogImageUrl}
        ogImageWidth="1200"
        ogImageHeight="630"
        ogImageType="image/png"
      />
      <WeddingTemplate config={config} templateId={templateId} />

      <div id="rsvp-form">
        <RsvpForm invitationId={invitationId!} brideName={brideName} groomName={groomName} />
      </div>
    </div>
  );
};

export default LiveInvite;
