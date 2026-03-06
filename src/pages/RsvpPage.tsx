import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import RsvpForm from "@/components/invite/RsvpForm";

const RsvpPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [brideName, setBrideName] = useState("Bride");
  const [groomName, setGroomName] = useState("Groom");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("invitations")
        .select("id, bride_name, groom_name")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (!data) { setNotFound(true); } else {
        setInvitationId(data.id);
        setBrideName(data.bride_name || "Bride");
        setGroomName(data.groom_name || "Groom");
      }
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Skeleton className="h-96 w-full max-w-md" />
    </div>
  );

  if (notFound || !invitationId) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="text-5xl mb-6">💔</div>
      <h1 className="font-display text-2xl font-bold mb-3" style={{ color: "hsl(var(--maroon-dark))" }}>
        Invitation Not Found
      </h1>
      <p className="text-muted-foreground">This RSVP link is no longer valid.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <SEOHead
        title={`RSVP — ${brideName} & ${groomName}'s Wedding`}
        description={`RSVP for ${brideName} & ${groomName}'s wedding celebration.`}
        noIndex
      />
      <div className="max-w-md mx-auto text-center mb-8">
        <p className="font-display text-2xl font-bold" style={{ color: "hsl(var(--maroon-dark))" }}>
          {brideName} & {groomName}
        </p>
        <p className="text-sm text-muted-foreground mt-1">Wedding RSVP</p>
      </div>
      <RsvpForm invitationId={invitationId} brideName={brideName} groomName={groomName} />
    </div>
  );
};

export default RsvpPage;
