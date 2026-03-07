export interface EventData {
  event_type: "mehndi" | "haldi" | "sangeet" | "baraat" | "ceremony" | "reception";
  event_name: string;
  is_enabled: boolean;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  maps_url: string;
  tagline: string;
  description: string;
  event_photo: string;
}

export interface BuilderFormData {
  bride_name: string;
  groom_name: string;
  bride_family: string;
  groom_family: string;
  bride_full_name: string;
  groom_full_name: string;
  bride_bio: string;
  groom_bio: string;
  personal_message: string;
  our_story: string;
  events: EventData[];
  photo_url: string | null;
  gallery_photos: string[];
  language: "english" | "hindi" | "tamil" | "punjabi" | "urdu";
  upi_id: string;
  gift_registry_url: string;
  dresscode_enabled: boolean;
  dresscode_text: string;
  dresscode_colors: string[];
  music_url: string;
  wedding_city: string;
  venue_description: string;
  venue_photo: string;
  rsvp_deadline: string;
  hero_media_type: "photo" | "video";
  hero_media_url: string;
}

export const DEFAULT_TAGLINES: Record<string, string> = {
  mehndi: "The Art of Love",
  haldi: "The Golden Glow",
  sangeet: "The Night of Stars",
  baraat: "The Grand Arrival",
  ceremony: "The Sacred Union",
  reception: "The Grand Celebration",
};

export const defaultEvents = (ceremonyLabel: string): EventData[] => [
  { event_type: "mehndi", event_name: "Mehndi", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "", tagline: DEFAULT_TAGLINES.mehndi, description: "", event_photo: "" },
  { event_type: "haldi", event_name: "Haldi", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "", tagline: DEFAULT_TAGLINES.haldi, description: "", event_photo: "" },
  { event_type: "sangeet", event_name: "Sangeet", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "", tagline: DEFAULT_TAGLINES.sangeet, description: "", event_photo: "" },
  { event_type: "baraat", event_name: "Baraat", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "", tagline: DEFAULT_TAGLINES.baraat, description: "", event_photo: "" },
  { event_type: "ceremony", event_name: ceremonyLabel, is_enabled: true, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "", tagline: DEFAULT_TAGLINES.ceremony, description: "", event_photo: "" },
  { event_type: "reception", event_name: "Reception", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "", tagline: DEFAULT_TAGLINES.reception, description: "", event_photo: "" },
];
