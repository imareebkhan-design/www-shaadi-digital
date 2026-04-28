/**
 * Custom Section Module Implementations
 * ─────────────────────────────────────
 * Handles template-specific sections and custom fields
 */

import type { CustomSectionModule } from "./modules";

/**
 * Standard Custom Section Module
 * Basic custom sections for most templates
 */
export const StandardCustomSectionModule: CustomSectionModule = {
  getCustomSections() {
    return [
      {
        id: "dresscode",
        label: "Dress Code",
        required: false,
        component: "DressCodeSection",
      },
      {
        id: "gift_registry",
        label: "Gift Registry",
        required: false,
        component: "GiftRegistrySection",
      },
    ];
  },

  getCustomFields() {
    return {
      dresscode_enabled: {
        type: "boolean",
        label: "Enable Dress Code",
        required: false,
      },
      dresscode_text: {
        type: "text",
        label: "Dress Code Description",
        required: false,
      },
      dresscode_colors: {
        type: "array",
        label: "Dress Code Colors",
        required: false,
      },
      gift_registry_url: {
        type: "url",
        label: "Gift Registry URL",
        required: false,
      },
    };
  },

  validateCustomFields(data: any): Record<string, string> {
    const errors: Record<string, string> = {};

    if (data.dresscode_enabled && !data.dresscode_text?.trim()) {
      errors.dresscode_text = "Dress code description is required when dress code is enabled";
    }

    if (data.gift_registry_url && !/^https?:\/\/.+/.test(data.gift_registry_url)) {
      errors.gift_registry_url = "Please enter a valid URL";
    }

    return errors;
  },
};

/**
 * Luxury Custom Section Module
 * Enhanced custom sections for premium templates
 */
export const LuxuryCustomSectionModule: CustomSectionModule = {
  ...StandardCustomSectionModule,

  getCustomSections() {
    return [
      ...StandardCustomSectionModule.getCustomSections(),
      {
        id: "rsvp",
        label: "RSVP Settings",
        required: true,
        component: "RSVPSection",
      },
      {
        id: "timeline",
        label: "Wedding Timeline",
        required: false,
        component: "TimelineSection",
      },
    ];
  },

  getCustomFields() {
    return {
      ...StandardCustomSectionModule.getCustomFields(),
      rsvp_deadline: {
        type: "date",
        label: "RSVP Deadline",
        required: true,
      },
      timeline_enabled: {
        type: "boolean",
        label: "Show Wedding Timeline",
        required: false,
      },
    };
  },

  validateCustomFields(data: any): Record<string, string> {
    const errors = StandardCustomSectionModule.validateCustomFields(data);

    if (!data.rsvp_deadline) {
      errors.rsvp_deadline = "RSVP deadline is required for luxury templates";
    }

    return errors;
  },
};

/**
 * Minimalist Custom Section Module
 * Simplified custom sections for basic templates
 */
export const MinimalistCustomSectionModule: CustomSectionModule = {
  ...StandardCustomSectionModule,

  getCustomSections() {
    return [
      {
        id: "dresscode",
        label: "Dress Code",
        required: false,
        component: "DressCodeSection",
      },
    ];
  },
};