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
}

// ── Internal flat format (used by DB layer & BaseTemplate) ──
export interface InvitationData {
  bride_name: string;
  groom_name: string;
  bride_family: string;
  groom_family: string;
  personal_message?: string;
  our_story?: string;
  wedding_date: string;
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
}

export interface WeddingTemplateConfig {
  couple: CoupleConfig;
  weddingDate: string;
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
}

// ── Adapters ──

export function configToInvitationData(config: WeddingTemplateConfig): InvitationData {
  return {
    bride_name: config.couple.brideName,
    groom_name: config.couple.groomName,
    bride_family: config.couple.brideFamily || "",
    groom_family: config.couple.groomFamily || "",
    personal_message: config.personalMessage,
    our_story: config.couple.story,
    wedding_date: config.weddingDate,
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
    })),
    upi_id: config.upiId,
    gift_registry_url: config.giftRegistryUrl,
    dresscode_enabled: config.dresscodeEnabled,
    dresscode_text: config.dresscodeText,
    dresscode_colors: config.dresscodeColors,
    music_url: config.musicUrl,
  };
}

export function invitationDataToConfig(data: InvitationData): WeddingTemplateConfig {
  return {
    couple: {
      brideName: data.bride_name,
      groomName: data.groom_name,
      brideFamily: data.bride_family,
      groomFamily: data.groom_family,
      photoUrl: data.photo_url,
      story: data.our_story,
    },
    weddingDate: data.wedding_date,
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
    })),
    galleryPhotos: data.gallery_photos,
    upiId: data.upi_id,
    giftRegistryUrl: data.gift_registry_url,
    dresscodeEnabled: data.dresscode_enabled,
    dresscodeText: data.dresscode_text,
    dresscodeColors: data.dresscode_colors,
    musicUrl: data.music_url,
  };
}
