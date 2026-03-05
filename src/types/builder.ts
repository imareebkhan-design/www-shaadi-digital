export interface EventData {
  event_type: "mehndi" | "haldi" | "sangeet" | "baraat" | "ceremony" | "reception";
  event_name: string;
  is_enabled: boolean;
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  maps_url: string;
}

export interface BuilderFormData {
  bride_name: string;
  groom_name: string;
  bride_family: string;
  groom_family: string;
  personal_message: string;
  events: EventData[];
  photo_url: string | null;
  language: "english" | "hindi" | "tamil" | "punjabi" | "urdu";
  upi_id: string;
  gift_registry_url: string;
}

export const defaultEvents = (ceremonyLabel: string): EventData[] => [
  { event_type: "mehndi", event_name: "Mehndi", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
  { event_type: "haldi", event_name: "Haldi", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
  { event_type: "sangeet", event_name: "Sangeet", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
  { event_type: "baraat", event_name: "Baraat", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
  { event_type: "ceremony", event_name: ceremonyLabel, is_enabled: true, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
  { event_type: "reception", event_name: "Reception", is_enabled: false, event_date: "", event_time: "", venue_name: "", venue_address: "", maps_url: "" },
];
