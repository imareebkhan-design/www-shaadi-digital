/**
 * Event Module Implementations
 * ────────────────────────────
 * Concrete implementations of event handling logic
 */

import type { EventModule, WeddingType } from "./modules";

/**
 * Standard Event Module
 * Handles traditional Hindu wedding events
 */
export const StandardEventModule: EventModule = {
  getVisibleEventTypes(weddingType: WeddingType): string[] {
    const eventMap: Record<WeddingType, string[]> = {
      hindu: ["mehndi", "haldi", "sangeet", "baraat", "ceremony", "reception"],
      sikh: ["mehndi", "sangeet", "ceremony", "reception"],
      muslim: ["mehndi", "ceremony", "reception"],
      christian: ["ceremony", "reception"],
      other: ["ceremony", "reception"],
    };
    return eventMap[weddingType] || eventMap.hindu;
  },

  getEventLabels() {
    return {
      mehndi: {
        name: "Mehndi",
        emoji: "🌿",
        defaultTagline: "The Art of Love",
        defaultDescription: "An intimate afternoon of intricate henna artistry, music, and celebration with close family and friends.",
      },
      haldi: {
        name: "Haldi",
        emoji: "🌼",
        defaultTagline: "The Golden Glow",
        defaultDescription: "A joyful morning ceremony filled with turmeric, blessings, and laughter shared with loved ones.",
      },
      sangeet: {
        name: "Sangeet",
        emoji: "🎶",
        defaultTagline: "The Night of Stars",
        defaultDescription: "An enchanting evening of music, dance performances, and joyous celebrations under the stars.",
      },
      baraat: {
        name: "Baraat",
        emoji: "🐴",
        defaultTagline: "The Grand Arrival",
        defaultDescription: "A grand and festive procession as the groom arrives with family and friends in high spirits.",
      },
      ceremony: {
        name: "Ceremony",
        emoji: "🕉️",
        defaultTagline: "The Sacred Union",
        defaultDescription: "The sacred union of two souls, bound by love, blessings, and the warmth of family.",
      },
      reception: {
        name: "Reception",
        emoji: "🥂",
        defaultTagline: "The Grand Celebration",
        defaultDescription: "An elegant evening of celebration, good food, and cherished moments with all who joined us on this journey.",
      },
    };
  },

  getCeremonyLabel(weddingType: WeddingType): string {
    const labels: Record<WeddingType, string> = {
      hindu: "Vivah",
      sikh: "Anand Karaj",
      muslim: "Nikah",
      christian: "Wedding Ceremony",
      other: "Wedding Ceremony",
    };
    return labels[weddingType] || "Wedding Ceremony";
  },

  isEventVisible(eventType: string, weddingType: WeddingType): boolean {
    return this.getVisibleEventTypes(weddingType).includes(eventType);
  },
};

/**
 * Minimalist Event Module
 * For simple, modern templates with fewer events
 */
export const MinimalistEventModule: EventModule = {
  ...StandardEventModule,

  getVisibleEventTypes(): string[] {
    return ["ceremony"];
  },

  getEventLabels() {
    return {
      ceremony: {
        name: "Ceremony",
        emoji: "💍",
        defaultTagline: "Our Special Day",
        defaultDescription: "A beautiful celebration of love and commitment.",
      },
    };
  },
};

/**
 * Luxury Event Module
 * For premium templates with enhanced event descriptions
 */
export const LuxuryEventModule: EventModule = {
  ...StandardEventModule,

  getEventLabels() {
    const baseLabels = StandardEventModule.getEventLabels();
    return {
      ...baseLabels,
      ceremony: {
        ...baseLabels.ceremony,
        defaultDescription: "An exquisite ceremony celebrating the union of two souls in eternal love and harmony.",
      },
      reception: {
        ...baseLabels.reception,
        defaultDescription: "A lavish evening of celebration featuring gourmet cuisine, fine wines, and unforgettable moments.",
      },
    };
  },
};