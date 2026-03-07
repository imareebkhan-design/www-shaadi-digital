// ── Event types ──
export interface InvitationEvent {
  event_type: string;
  event_name: string;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  maps_url?: string;
  is_enabled: boolean;
  tagline?: string;
  description?: string;
  event_photo?: string;
}

// ── Internal flat format (used by DB layer & BaseTemplate) ──
export interface InvitationData {
  bride_name: string;
  groom_name: string;
  bride_family: string;
  groom_family: string;
  bride_full_name?: string;
  groom_full_name?: string;
  bride_bio?: string;
  groom_bio?: string;
  personal_message?: string;
  our_story?: string;
  wedding_date: string;
  wedding_city?: string;
  photo_url?: string;
  gallery_photos?: string[];
  language: "english" | "hindi" | "tamil" | "punjabi" | "urdu";
  events: InvitationEvent[];
  upi_id?: string;
  gift_registry_url?: string;
  dresscode_enabled?: boolean;
  dresscode_text?: string;
  dresscode_colors?: string[];
  music_url?: string;
  venue_description?: string;
  venue_photo?: string;
  rsvp_deadline?: string;
  hero_media_type?: "photo" | "video";
  hero_media_url?: string;
}

export interface TemplateProps {
  data: InvitationData;
  isPreview?: boolean;
}

// ── Public config-based API ──

export interface CoupleConfig {
  brideName: string;
  groomName: string;
  brideFamily?: string;
  groomFamily?: string;
  brideFullName?: string;
  groomFullName?: string;
  brideBio?: string;
  groomBio?: string;
  photoUrl?: string;
  story?: string;
}

export interface EventConfig {
  type: string;
  name: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
  enabled?: boolean;
  tagline?: string;
  description?: string;
  eventPhoto?: string;
}

export interface WeddingTemplateConfig {
  couple: CoupleConfig;
  weddingDate: string;
  weddingCity?: string;
  personalMessage?: string;
  language?: "english" | "hindi" | "tamil" | "punjabi" | "urdu";
  events?: EventConfig[];
  galleryPhotos?: string[];
  upiId?: string;
  giftRegistryUrl?: string;
  dresscodeEnabled?: boolean;
  dresscodeText?: string;
  dresscodeColors?: string[];
  musicUrl?: string;
  venueDescription?: string;
  venuePhoto?: string;
  rsvpDeadline?: string;
  heroMediaType?: "photo" | "video";
  heroMediaUrl?: string;
}

// ── Adapters ──

export function configToInvitationData(config: WeddingTemplateConfig): InvitationData {
  return {
    bride_name: config.couple.brideName,
    groom_name: config.couple.groomName,
    bride_family: config.couple.brideFamily || "",
    groom_family: config.couple.groomFamily || "",
    bride_full_name: config.couple.brideFullName,
    groom_full_name: config.couple.groomFullName,
    bride_bio: config.couple.brideBio,
    groom_bio: config.couple.groomBio,
    personal_message: config.personalMessage,
    our_story: config.couple.story,
    wedding_date: config.weddingDate,
    wedding_city: config.weddingCity,
    photo_url: config.couple.photoUrl,
    gallery_photos: config.galleryPhotos,
    language: config.language || "english",
    events: (config.events || []).map((e) => ({
      event_type: e.type,
      event_name: e.name,
      event_date: e.date,
      event_time: e.time,
      venue_name: e.venueName,
      venue_address: e.venueAddress,
      maps_url: e.mapsUrl,
      is_enabled: e.enabled !== false,
      tagline: e.tagline,
      description: e.description,
      event_photo: e.eventPhoto,
    })),
    upi_id: config.upiId,
    gift_registry_url: config.giftRegistryUrl,
    dresscode_enabled: config.dresscodeEnabled,
    dresscode_text: config.dresscodeText,
    dresscode_colors: config.dresscodeColors,
    music_url: config.musicUrl,
    venue_description: config.venueDescription,
    venue_photo: config.venuePhoto,
    rsvp_deadline: config.rsvpDeadline,
    hero_media_type: config.heroMediaType,
    hero_media_url: config.heroMediaUrl,
  };
}

export function invitationDataToConfig(data: InvitationData): WeddingTemplateConfig {
  return {
    couple: {
      brideName: data.bride_name,
      groomName: data.groom_name,
      brideFamily: data.bride_family,
      groomFamily: data.groom_family,
      brideFullName: data.bride_full_name,
      groomFullName: data.groom_full_name,
      brideBio: data.bride_bio,
      groomBio: data.groom_bio,
      photoUrl: data.photo_url,
      story: data.our_story,
    },
    weddingDate: data.wedding_date,
    weddingCity: data.wedding_city,
    personalMessage: data.personal_message,
    language: data.language,
    events: data.events.map((e) => ({
      type: e.event_type,
      name: e.event_name,
      date: e.event_date,
      time: e.event_time,
      venueName: e.venue_name,
      venueAddress: e.venue_address,
      mapsUrl: e.maps_url,
      enabled: e.is_enabled,
      tagline: e.tagline,
      description: e.description,
      eventPhoto: e.event_photo,
    })),
    galleryPhotos: data.gallery_photos,
    upiId: data.upi_id,
    giftRegistryUrl: data.gift_registry_url,
    dresscodeEnabled: data.dresscode_enabled,
    dresscodeText: data.dresscode_text,
    dresscodeColors: data.dresscode_colors,
    musicUrl: data.music_url,
    venueDescription: data.venue_description,
    venuePhoto: data.venue_photo,
    rsvpDeadline: data.rsvp_deadline,
    heroMediaType: data.hero_media_type,
    heroMediaUrl: data.hero_media_url,
  };
}
