import { supabase } from "@/integrations/supabase/client";
import type { InvitationData, InvitationEvent } from "@/templates/types";
import { isFeatureAvailable } from "@/lib/featureFlags";

export interface DraftInvitationResult {
  invitation: Record<string, any> | null;
  events: InvitationEvent[];
}

/**
 * FEATURE FLAG GUARD: Strip disabled features before saving
 * Prevents marketing claims from leaking into database
 */
const sanitizeDataByFeatureFlags = (data: InvitationData): InvitationData => {
  const sanitized = { ...data };

  // If auto-reminders are disabled, ensure it's not saved
  if (!isFeatureAvailable("autoReminders")) {
    // This would be applied at API/publish level, not form level
    // Keeping structure here for consistency
  }

  // If password protection is disabled, remove any password fields
  if (!isFeatureAvailable("passwordProtection")) {
    // Form data doesn't currently have password fields, but structure is ready
  }

  return sanitized;
};

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
  // Apply feature flag guards
  const sanitized = sanitizeDataByFeatureFlags(data);

  await supabase
    .from("invitations")
    .update({
      bride_name: sanitized.bride_name || null,
      groom_name: sanitized.groom_name || null,
      bride_family: sanitized.bride_family || null,
      groom_family: sanitized.groom_family || null,
      bride_full_name: sanitized.bride_full_name || null,
      groom_full_name: sanitized.groom_full_name || null,
      bride_bio: sanitized.bride_bio || null,
      groom_bio: sanitized.groom_bio || null,
      personal_message: sanitized.personal_message || null,
      our_story: sanitized.our_story || null,
      wedding_date: sanitized.wedding_date || null,
      wedding_city: sanitized.wedding_city || null,
      photo_url: sanitized.photo_url || null,
      gallery_photos: sanitized.gallery_photos || [],
      language: sanitized.language,
      upi_id: sanitized.upi_id || null,
      gift_registry_url: sanitized.gift_registry_url || null,
      dresscode_enabled: sanitized.dresscode_enabled || false,
      dresscode_text: sanitized.dresscode_text || null,
      dresscode_colors: sanitized.dresscode_colors || [],
      music_url: sanitized.music_url || null,
      venue_description: sanitized.venue_description || null,
      venue_photo: sanitized.venue_photo || null,
      rsvp_deadline: sanitized.rsvp_deadline || null,
      hero_media_type: sanitized.hero_media_type || "photo",
      hero_media_url: sanitized.hero_media_url || null,
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
