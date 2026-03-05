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

export interface InvitationData {
  bride_name: string;
  groom_name: string;
  bride_family: string;
  groom_family: string;
  personal_message?: string;
  wedding_date: string;
  photo_url?: string;
  language: "english" | "hindi" | "tamil" | "punjabi" | "urdu";
  events: InvitationEvent[];
  upi_id?: string;
  gift_registry_url?: string;
}

export interface TemplateProps {
  data: InvitationData;
  isPreview?: boolean;
}
