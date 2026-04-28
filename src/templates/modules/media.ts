/**
 * Media Module Implementations
 * ────────────────────────────
 * Handles media uploads, galleries, and validation
 */

import type { MediaModule } from "./modules";

/**
 * Standard Media Module
 * Basic media handling for most templates
 */
export const StandardMediaModule: MediaModule = {
  getRequiredMediaFields(): string[] {
    return [];
  },

  getOptionalMediaFields(): string[] {
    return ["photo_url", "gallery_photos", "venue_photo", "hero_media_url"];
  },

  validateMediaField(fieldName: string, value: any): boolean {
    if (!value) return true; // Optional fields can be empty

    switch (fieldName) {
      case "photo_url":
      case "venue_photo":
      case "hero_media_url":
        return typeof value === "string" && value.length > 0;
      case "gallery_photos":
        return Array.isArray(value);
      default:
        return true;
    }
  },

  getMediaFieldLabels(): Record<string, string> {
    return {
      photo_url: "Couple Photo",
      gallery_photos: "Gallery Photos",
      venue_photo: "Venue Photo",
      hero_media_url: "Hero Media",
      music_url: "Background Music",
    };
  },
};

/**
 * Luxury Media Module
 * Enhanced media requirements for premium templates
 */
export const LuxuryMediaModule: MediaModule = {
  ...StandardMediaModule,

  getRequiredMediaFields(): string[] {
    return ["venue_photo"];
  },

  getOptionalMediaFields(): string[] {
    return ["photo_url", "gallery_photos", "hero_media_url", "music_url"];
  },

  validateMediaField(fieldName: string, value: any): boolean {
    if (this.getRequiredMediaFields().includes(fieldName)) {
      return value && typeof value === "string" && value.length > 0;
    }
    return StandardMediaModule.validateMediaField(fieldName, value);
  },
};

/**
 * Minimalist Media Module
 * Simplified media for basic templates
 */
export const MinimalistMediaModule: MediaModule = {
  ...StandardMediaModule,

  getOptionalMediaFields(): string[] {
    return ["photo_url", "hero_media_url"];
  },
};