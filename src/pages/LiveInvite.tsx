import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getTemplateById } from "@/data/templates";
import { Skeleton } from "@/components/ui/skeleton";
import RsvpForm from "@/components/invite/RsvpForm";
import InviteHero from "@/components/invite/InviteHero";
import InvitePhoto from "@/components/invite/InvitePhoto";
import InviteMessage from "@/components/invite/InviteMessage";
import InviteEvents from "@/components/invite/InviteEvents";
import InviteFamily from "@/components/invite/InviteFamily";
import InviteRsvpCta from "@/components/invite/InviteRsvpCta";
import InviteFooter from "@/components/invite/InviteFooter";
import type { Tables } from "@/integrations/supabase/types";

type Invitation = Tables<"invitations">;
type Event = Tables<"events">;

const LiveInvite = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    const fetchInvite = async () => {
      const { data: inv } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!inv) { setNotFound(true); setLoading(false); return; }
      setInvitation(inv);

      const { data: evts } = await supabase
        .from("events")
        .select("*")
        .eq("invitation_id", inv.id)
        .eq("is_enabled", true)
        .order("created_at", { ascending: true });

      setEvents(evts || []);
      setLoading(false);
    };

    fetchInvite();
  }, [slug]);

  const template = invitation ? getTemplateById(invitation.template_id) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-80 w-full max-w-md" />
      </div>
    );
  }

  if (notFound || !invitation) {
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

  const gradientClass = template?.gradient || "from-[#7B1C2E] to-[#4a1019]";
  const motif = template?.motif || "✦";
  const brideName = invitation.bride_name || "Bride";
  const groomName = invitation.groom_name || "Groom";

  return (
    <div className="min-h-screen bg-background">
      <InviteHero
        brideName={brideName}
        groomName={groomName}
        weddingDate={invitation.wedding_date}
        brideFamily={invitation.bride_family}
        groomFamily={invitation.groom_family}
        motif={motif}
        gradientClass={gradientClass}
      />

      <InvitePhoto photoUrl={invitation.photo_url} brideName={brideName} groomName={groomName} />

      <InviteMessage message={invitation.personal_message} />

      {events.length > 0 && (
        <InviteEvents events={events} gradientClass={gradientClass} />
      )}

      <InviteFamily brideFamily={invitation.bride_family} groomFamily={invitation.groom_family} brideName={brideName} groomName={groomName} />

      <InviteRsvpCta brideName={brideName} groomName={groomName} />

      <div id="rsvp-form">
        <RsvpForm invitationId={invitation.id} brideName={brideName} groomName={groomName} />
      </div>

      <InviteFooter
        invitation={invitation}
        events={events}
        brideName={brideName}
        groomName={groomName}
      />
    </div>
  );
};

export default LiveInvite;
