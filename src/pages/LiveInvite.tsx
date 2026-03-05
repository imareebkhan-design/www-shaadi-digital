import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TEMPLATE_REGISTRY } from "@/templates";
import type { InvitationData } from "@/templates/types";
import RsvpForm from "@/components/invite/RsvpForm";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Event = Tables<"events">;

const LiveInvite = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    const fetch = async () => {
      const { data: inv } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!inv) { setNotFound(true); setLoading(false); return; }
      setInvitation(inv);

      const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("invitation_id", inv.id)
        .order("event_date", { ascending: true });

      const data: InvitationData = {
        bride_name: inv.bride_name || "Bride",
        groom_name: inv.groom_name || "Groom",
        bride_family: inv.bride_family || "",
        groom_family: inv.groom_family || "",
        personal_message: inv.personal_message || undefined,
        our_story: (inv as any).our_story || undefined,
        wedding_date: inv.wedding_date || "",
        photo_url: inv.photo_url || undefined,
        gallery_photos: (inv as any).gallery_photos || [],
        language: inv.language || "english",
        upi_id: inv.upi_id || undefined,
        gift_registry_url: inv.gift_registry_url || undefined,
        dresscode_enabled: (inv as any).dresscode_enabled || false,
        dresscode_text: (inv as any).dresscode_text || undefined,
        dresscode_colors: (inv as any).dresscode_colors || [],
        music_url: (inv as any).music_url || undefined,
        events: (events || []).map((e: Event) => ({
          event_type: e.event_type,
          event_name: e.event_name,
          event_date: e.event_date || "",
          event_time: e.event_time || "",
          venue_name: e.venue_name || "",
          venue_address: e.venue_address || "",
          maps_url: e.maps_url || undefined,
          is_enabled: e.is_enabled,
        })),
      };

      setInvitationData(data);
      setLoading(false);
    };

    fetch();
  }, [slug]);

  // Loading state
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

  // Not found
  if (notFound || !invitation || !invitationData) {
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

  // Look up template
  const templateEntry = TEMPLATE_REGISTRY[invitation.template_id];
  const TemplateComponent = templateEntry?.component;

  if (!TemplateComponent) {
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

  const brideName = invitationData.bride_name;
  const groomName = invitationData.groom_name;

  return (
    <div className="min-h-screen bg-background">
      <TemplateComponent data={invitationData} isPreview={false} />

      <div id="rsvp-form">
        <RsvpForm invitationId={invitation.id} brideName={brideName} groomName={groomName} />
      </div>
    </div>
  );
};

export default LiveInvite;
