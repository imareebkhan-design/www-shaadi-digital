/**
 * Language Module Implementations
 * ───────────────────────────────
 * Handles language-specific content and translations
 */

import type { LanguageModule } from "./modules";

/**
 * Standard Language Module
 * Basic multilingual support
 */
export const StandardLanguageModule: LanguageModule = {
  getSupportedLanguages(): string[] {
    return ["english", "hindi", "punjabi", "urdu", "gujarati", "marathi"];
  },

  getDefaultContent(language: string): Record<string, string> {
    const content: Record<string, Record<string, string>> = {
      english: {
        personal_message: "With joy in our hearts and blessings of our families, we joyfully invite you to celebrate our wedding.",
        our_story: "We met on a rainy evening in Delhi, and from that very first cup of chai, we knew something magical had begun. What started as friendship slowly blossomed into a love story we're proud to share with the people we cherish most.",
      },
      hindi: {
        personal_message: "हमारे हृदय में खुशी और हमारे परिवारों की आशीर्वाद के साथ, हम आप सभी को हमारे विवाह समारोह में शामिल होने के लिए निमंत्रित करते हैं।",
        our_story: "हम दिल्ली में एक बारिश वाली शाम को मिले थे, और पहली चाय पीते ही हमें पता चल गया था कि कुछ जादुई होने वाला है। जो दोस्ती थी वह धीरे-धीरे एक प्यार की कहानी में बदल गई जिसे हम अपने सबसे करीबी लोगों के साथ साझा करना चाहते हैं।",
      },
    };

    return content[language] || content.english;
  },

  translateField(fieldName: string, value: string, language: string): string {
    // For now, return the original value
    // In a real implementation, this would use a translation service
    return value;
  },
};