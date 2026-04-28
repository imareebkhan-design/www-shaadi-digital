import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import SEOHead from "@/components/SEOHead";
import ErrorState from "@/components/ui/ErrorState";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import RsvpForm from "@/components/invite/RsvpForm";
import { normalizeSlug, validateSlug } from "@/lib/slugService";

const RsvpPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [brideName, setBrideName] = useState("Bride");
  const [groomName, setGroomName] = useState("Groom");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [invalidSlug, setInvalidSlug] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRsvp = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setInvalidSlug(false);

    if (!slug) {
      setInvalidSlug(true);
      setLoading(false);
      return;
    }

    const normalizedSlug = normalizeSlug(slug);
    if (!validateSlug(normalizedSlug)) {
      setInvalidSlug(true);
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from("invitations")
        .select("id, bride_name, groom_name")
        .eq("slug", normalizedSlug)
        .eq("status", "published")
        .maybeSingle();

      if (!data) {
        setNotFound(true);
      } else {
        setInvitationId(data.id);
        setBrideName(data.bride_name || "Bride");
        setGroomName(data.groom_name || "Groom");
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load this RSVP. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadRsvp();
  }, [loadRsvp]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Skeleton className="h-96 w-full max-w-md" />
    </div>
  );

  if (invalidSlug) return (
    <ErrorState
      title="Invalid RSVP link"
      message="The RSVP link appears malformed. Please check the link and try again."
      ctaLabel="Go home"
      ctaHref="/"
    />
  );

  if (error) return (
    <ErrorState
      title="Unable to load RSVP"
      message={error}
      ctaLabel="Retry"
      onRetry={loadRsvp}
      ctaHref="/"
    />
  );

  if (notFound || !invitationId) return (
    <ErrorState
      title="Invitation Not Found"
      message="This RSVP link is no longer valid or the invitation is unpublished."
      ctaLabel="Go home"
      ctaHref="/"
    />
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
