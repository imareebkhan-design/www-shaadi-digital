/**
 * Feature Flags & Capability Map
 * ───────────────────────────────
 * Controls which features are available and UI visibility
 * Prevents mismatch between marketing claims and backend capability
 */

export interface FeatureCapabilities {
  // Core features
  liveInvitations: boolean;
  rsvpTracking: boolean;
  whatsappDelivery: boolean;
  unlimitedRsvps: boolean;

  // Advanced features (claimed but not implemented)
  autoReminders: boolean;
  passwordProtection: boolean;
  nriTimezone: boolean;
  customDomain: boolean;

  // Template features
  videoBackgrounds: boolean;
  arabicScript: boolean;
  gurmukhiScript: boolean;
  multiLanguage: boolean;

  // Plan-specific features
  premiumSupport: boolean;
  priorityDelivery: boolean;
  customDesign: boolean;
  dedicatedManager: boolean;
}

export const FEATURE_FLAGS: FeatureCapabilities = {
  // Core features - fully implemented
  liveInvitations: true,
  rsvpTracking: true,
  whatsappDelivery: true,
  unlimitedRsvps: true,

  // Advanced features - claimed but NOT implemented
  autoReminders: false, // Manual only
  passwordProtection: false, // No per-invitation passwords
  nriTimezone: false, // No timezone detection
  customDomain: false, // No custom domains

  // Template features - partially implemented
  videoBackgrounds: true, // Some templates support video
  arabicScript: true, // Pearl Nikah template
  gurmukhiScript: false, // Claimed but not implemented
  multiLanguage: true, // Basic support

  // Plan-specific features
  premiumSupport: false, // No priority support system
  priorityDelivery: false, // All deliveries are standard
  customDesign: false, // No custom design service
  dedicatedManager: false, // No account management
};

/**
 * Check if a feature is available
 */
export const isFeatureAvailable = (feature: keyof FeatureCapabilities): boolean => {
  return FEATURE_FLAGS[feature];
};

/**
 * Get available features for a plan
 */
export const getPlanFeatures = (plan: 'basic' | 'premium' | 'elite'): Partial<FeatureCapabilities> => {
  const baseFeatures: Partial<FeatureCapabilities> = {
    liveInvitations: true,
    rsvpTracking: true,
    whatsappDelivery: true,
  };

  switch (plan) {
    case 'basic':
      return {
        ...baseFeatures,
        unlimitedRsvps: false, // Basic has limits
      };
    case 'premium':
      return {
        ...baseFeatures,
        unlimitedRsvps: true,
        // Note: autoReminders claimed but not implemented
        autoReminders: false,
      };
    case 'elite':
      return {
        ...baseFeatures,
        unlimitedRsvps: true,
        // Note: Many elite features claimed but not implemented
        autoReminders: false,
        passwordProtection: false,
        nriTimezone: false,
        customDomain: false,
        customDesign: false,
        dedicatedManager: false,
      };
    default:
      return baseFeatures;
  }
};