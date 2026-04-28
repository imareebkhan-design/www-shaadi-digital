/**
 * Ceremony Module Implementations
 * ───────────────────────────────
 * Handles ceremony naming and wedding type configurations
 */

import type { CeremonyModule, WeddingType } from "./modules";

/**
 * Standard Ceremony Module
 * Traditional ceremony naming across religions
 */
export const StandardCeremonyModule: CeremonyModule = {
  getCeremonyName(weddingType: WeddingType): string {
    const names: Record<WeddingType, string> = {
      hindu: "Vivah",
      sikh: "Anand Karaj",
      muslim: "Nikah",
      christian: "Wedding Ceremony",
      other: "Wedding Ceremony",
    };
    return names[weddingType] || "Wedding Ceremony";
  },

  getSupportedWeddingTypes(): WeddingType[] {
    return ["hindu", "sikh", "muslim", "christian", "other"];
  },

  getDefaultEvents(weddingType: WeddingType) {
    const ceremonyName = this.getCeremonyName(weddingType);
    return [
      {
        event_type: "ceremony",
        event_name: ceremonyName,
        is_enabled: true,
        tagline: "The Sacred Union",
        description: `The sacred union of two souls, bound by love, blessings, and the warmth of family.`,
        event_date: "",
        event_time: "",
        event_location: "",
        event_photo: "",
      },
    ];
  },
};

/**
 * Regional Ceremony Module
 * Region-specific ceremony naming
 */
export const RegionalCeremonyModule: CeremonyModule = {
  ...StandardCeremonyModule,

  getCeremonyName(weddingType: WeddingType): string {
    // Could be extended with region-specific names
    return StandardCeremonyModule.getCeremonyName(weddingType);
  },
};