import type { ComponentType } from "react";
import type { InvitationData, TemplateProps } from "./types";

import RoyalMaroon from "./RoyalMaroon";
import EmeraldSouth from "./EmeraldSouth";
import MidnightBlue from "./MidnightBlue";
import GoldenPunjabi from "./GoldenPunjabi";
import RoseGarden from "./RoseGarden";
import TealLuxury from "./TealLuxury";
import IvoryClassic from "./IvoryClassic";
import SaffronFest from "./SaffronFest";
import PearlNikah from "./PearlNikah";
import BlushModern from "./BlushModern";

export type { InvitationData, InvitationEvent, TemplateProps } from "./types";
export type { WeddingTemplateConfig, CoupleConfig, EventConfig } from "./types";
export { configToInvitationData, invitationDataToConfig } from "./types";
export { WeddingTemplate } from "./WeddingTemplate";

export interface TemplateRegistryEntry {
  id: string;
  name: string;
  component: ComponentType<TemplateProps>;
  community: string;
  tone: string;
  description: string;
  thumbnail_gradient: string;
  is_premium: boolean;
}

export const TEMPLATE_REGISTRY: Record<string, TemplateRegistryEntry> = {
  "royal-maroon": {
    id: "royal-maroon",
    name: "Royal Maroon",
    component: RoyalMaroon,
    community: "North Indian",
    tone: "Traditional",
    description: "Rich maroons and gold with mandala motifs",
    thumbnail_gradient: "linear-gradient(135deg, #3A0512, #7B1C2E)",
    is_premium: false,
  },
  "emerald-south": {
    id: "emerald-south",
    name: "Emerald South",
    component: EmeraldSouth,
    community: "South Indian",
    tone: "Elegant",
    description: "Jewel tones with temple motifs",
    thumbnail_gradient: "linear-gradient(135deg, #0d2818, #1a5c30)",
    is_premium: false,
  },
  "midnight-blue": {
    id: "midnight-blue",
    name: "Midnight Blue",
    component: MidnightBlue,
    community: "Modern",
    tone: "Minimal",
    description: "Sleek slate blues with diamond accents",
    thumbnail_gradient: "linear-gradient(135deg, #1e293b, #0f172a)",
    is_premium: false,
  },
  "golden-punjabi": {
    id: "golden-punjabi",
    name: "Golden Punjabi",
    component: GoldenPunjabi,
    community: "Sikh",
    tone: "Traditional",
    description: "Warm gold with Khanda motifs",
    thumbnail_gradient: "linear-gradient(135deg, #3d2800, #8B6914)",
    is_premium: true,
  },
  "rose-garden": {
    id: "rose-garden",
    name: "Rose Garden",
    component: RoseGarden,
    community: "Muslim",
    tone: "Floral",
    description: "Soft rose and pink with floral patterns",
    thumbnail_gradient: "linear-gradient(135deg, #4c0519, #9f1239)",
    is_premium: false,
  },
  "teal-luxury": {
    id: "teal-luxury",
    name: "Teal Luxury",
    component: TealLuxury,
    community: "South Indian",
    tone: "Luxury",
    description: "Deep teal with jewelled accents",
    thumbnail_gradient: "linear-gradient(135deg, #0f3d3e, #134e4a)",
    is_premium: true,
  },
  "ivory-classic": {
    id: "ivory-classic",
    name: "Ivory Classic",
    component: IvoryClassic,
    community: "North Indian",
    tone: "Luxury",
    description: "Warm ivory and gold in a classic design",
    thumbnail_gradient: "linear-gradient(135deg, #3a2e1a, #5c4a2f)",
    is_premium: true,
  },
  "saffron-fest": {
    id: "saffron-fest",
    name: "Saffron Fest",
    component: SaffronFest,
    community: "North Indian",
    tone: "Playful",
    description: "Vibrant saffron and red, full of energy",
    thumbnail_gradient: "linear-gradient(135deg, #9a3412, #ea580c)",
    is_premium: false,
  },
  "pearl-nikah": {
    id: "pearl-nikah",
    name: "Pearl Nikah",
    component: PearlNikah,
    community: "Muslim",
    tone: "Minimal",
    description: "Elegant pearl and stone tones",
    thumbnail_gradient: "linear-gradient(135deg, #292524, #57534e)",
    is_premium: false,
  },
  "blush-modern": {
    id: "blush-modern",
    name: "Blush Modern",
    component: BlushModern,
    community: "Modern",
    tone: "Minimal",
    description: "Contemporary blush pink and fuchsia",
    thumbnail_gradient: "linear-gradient(135deg, #a21caf, #f472b6)",
    is_premium: false,
  },
};

export type TemplateId = keyof typeof TEMPLATE_REGISTRY;

export const getTemplateComponent = (templateId: string): ComponentType<TemplateProps> | null =>
  TEMPLATE_REGISTRY[templateId]?.component || null;

export const DEMO_DATA: InvitationData = {
  bride_name: "Ananya",
  groom_name: "Rohan",
  bride_family: "Daughter of Shri Ramesh & Smt. Sunita Sharma, New Delhi",
  groom_family: "Son of Shri Vijay & Smt. Meena Kapoor, Mumbai",
  personal_message: "Together with our families, we joyfully invite you to celebrate our wedding.",
  our_story: "We met on a rainy evening in Delhi, and from that very first cup of chai together, we knew something beautiful had begun.",
  wedding_date: "2025-11-15",
  language: "english",
  gallery_photos: [],
  dresscode_enabled: false,
  dresscode_text: "",
  dresscode_colors: [],
  music_url: "",
  events: [
    { event_type: "mehndi", event_name: "Mehndi", event_date: "2025-11-13", event_time: "16:00", venue_name: "Sharma Residence", venue_address: "Vasant Kunj, New Delhi", maps_url: "", is_enabled: true },
    { event_type: "haldi", event_name: "Haldi", event_date: "2025-11-14", event_time: "10:00", venue_name: "Sharma Residence", venue_address: "Vasant Kunj, New Delhi", maps_url: "", is_enabled: true },
    { event_type: "sangeet", event_name: "Sangeet", event_date: "2025-11-14", event_time: "19:00", venue_name: "The Grand Ballroom", venue_address: "The Leela Palace, New Delhi", maps_url: "", is_enabled: true },
    { event_type: "ceremony", event_name: "Vivah", event_date: "2025-11-15", event_time: "21:00", venue_name: "The Leela Palace", venue_address: "Chanakyapuri, New Delhi", maps_url: "", is_enabled: true },
    { event_type: "reception", event_name: "Reception", event_date: "2025-11-16", event_time: "19:00", venue_name: "The Leela Palace", venue_address: "Chanakyapuri, New Delhi", maps_url: "", is_enabled: true },
  ],
};

/** Config-format demo data for the public WeddingTemplate API */
export const DEMO_CONFIG: import("./types").WeddingTemplateConfig = {
  couple: {
    brideName: "Ananya",
    groomName: "Rohan",
    brideFamily: "Daughter of Shri Ramesh & Smt. Sunita Sharma, New Delhi",
    groomFamily: "Son of Shri Vijay & Smt. Meena Kapoor, Mumbai",
    story: "We met on a rainy evening in Delhi, and from that very first cup of chai together, we knew something beautiful had begun.",
  },
  weddingDate: "2025-11-15",
  personalMessage: "Together with our families, we joyfully invite you to celebrate our wedding.",
  language: "english",
  events: [
    { type: "mehndi", name: "Mehndi", date: "2025-11-13", time: "16:00", venueName: "Sharma Residence", venueAddress: "Vasant Kunj, New Delhi" },
    { type: "haldi", name: "Haldi", date: "2025-11-14", time: "10:00", venueName: "Sharma Residence", venueAddress: "Vasant Kunj, New Delhi" },
    { type: "sangeet", name: "Sangeet", date: "2025-11-14", time: "19:00", venueName: "The Grand Ballroom", venueAddress: "The Leela Palace, New Delhi" },
    { type: "ceremony", name: "Vivah", date: "2025-11-15", time: "21:00", venueName: "The Leela Palace", venueAddress: "Chanakyapuri, New Delhi" },
    { type: "reception", name: "Reception", date: "2025-11-16", time: "19:00", venueName: "The Leela Palace", venueAddress: "Chanakyapuri, New Delhi" },
  ],
};

export default TEMPLATE_REGISTRY;
