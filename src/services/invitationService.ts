import { supabase } from "@/integrations/supabase/client";
import type { InvitationData, InvitationEvent } from "@/templates/types";

export interface DraftInvitationResult {
  invitation: Record<string, any> | null;
  events: InvitationEvent[];
}

export async function fetchDraftInvitation(userId: string, templateId: string): Promise<DraftInvitationResult> {
  const { data: existing } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", userId)
    .eq("template_id", templateId)
    .eq("status", "draft")
    .maybeSingle();

  if (!existing) {
    return { invitation: null, events: [] };
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("invitation_id", existing.id);

  return { invitation: existing, events: (events as InvitationEvent[]) || [] };
}

export async function createDraftInvitation(userId: string, templateId: string, events: InvitationEvent[]) {
  const { data: newInv } = await supabase
    .from("invitations")
    .insert({ user_id: userId, template_id: templateId })
    .select()
    .single();

  if (!newInv) return null;

  await supabase.from("events").insert(
    events.map((event) => ({
      invitation_id: newInv.id,
      event_type: event.event_type,
      event_name: event.event_name,
      is_enabled: event.is_enabled,
      event_date: event.event_date || null,
      event_time: event.event_time || null,
      venue_name: event.venue_name || null,
      venue_address: event.venue_address || null,
      maps_url: event.maps_url || null,
      tagline: event.tagline || null,
      description: event.description || null,
      event_photo: event.event_photo || null,
    }))
  );

  return newInv;
}

export async function updateDraftInvitation(invitationId: string, data: InvitationData) {
  await supabase
    .from("invitations")
    .update({
      bride_name: data.bride_name || null,
      groom_name: data.groom_name || null,
      bride_family: data.bride_family || null,
      groom_family: data.groom_family || null,
      bride_full_name: data.bride_full_name || null,
      groom_full_name: data.groom_full_name || null,
      bride_bio: data.bride_bio || null,
      groom_bio: data.groom_bio || null,
      personal_message: data.personal_message || null,
      our_story: data.our_story || null,
      wedding_date: data.wedding_date || null,
      wedding_city: data.wedding_city || null,
      photo_url: data.photo_url || null,
      gallery_photos: data.gallery_photos || [],
      language: data.language,
      upi_id: data.upi_id || null,
      gift_registry_url: data.gift_registry_url || null,
      dresscode_enabled: data.dresscode_enabled || false,
      dresscode_text: data.dresscode_text || null,
      dresscode_colors: data.dresscode_colors || [],
      music_url: data.music_url || null,
      venue_description: data.venue_description || null,
      venue_photo: data.venue_photo || null,
      rsvp_deadline: data.rsvp_deadline || null,
      hero_media_type: data.hero_media_type || "photo",
      hero_media_url: data.hero_media_url || null,
    } as any)
    .eq("id", invitationId);
}

export async function updateDraftEvents(invitationId: string, events: InvitationEvent[]) {
  for (const event of events) {
    await supabase
      .from("events")
      .update({
        event_name: event.event_name,
        is_enabled: event.is_enabled,
        event_date: event.event_date || null,
        event_time: event.event_time || null,
        venue_name: event.venue_name || null,
        venue_address: event.venue_address || null,
        maps_url: event.maps_url || null,
        tagline: event.tagline || null,
        description: event.description || null,
        event_photo: event.event_photo || null,
      } as any)
      .eq("invitation_id", invitationId)
      .eq("event_type", event.event_type);
  }
}

export async function updateInvitationTemplate(invitationId: string, templateId: string) {
  await supabase
    .from("invitations")
    .update({ template_id: templateId } as any)
    .eq("id", invitationId);
}

export async function publishInvitation(
  invitationId: string,
  selectedPlan: "basic" | "premium" | "elite",
  slug: string,
  razorpayOrderId: string,
) {
  return supabase.rpc("publish_invitation" as any, {
    _invitation_id: invitationId,
    _plan: selectedPlan,
    _slug: slug,
    _razorpay_order_id: razorpayOrderId,
  });
}
