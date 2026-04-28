/**
 * Slug Utilities
 * ──────────────
 * Shared utilities for slug normalization and validation
 */

/**
 * Normalize a slug for database lookup
 * Handles URL decoding, case normalization, and trimming
 */
export const normalizeSlug = (slug: string): string => {
  try {
    // URL decode the slug
    const decoded = decodeURIComponent(slug);
    // Convert to lowercase and trim
    return decoded.toLowerCase().trim();
  } catch (error) {
    // If decoding fails, return the original slug normalized
    return slug.toLowerCase().trim();
  }
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== 'string') return false;
  if (slug.length < 2 || slug.length > 200) return false;

  // Allow alphanumeric, hyphens, underscores
  const validSlugRegex = /^[a-zA-Z0-9_-]+$/;
  return validSlugRegex.test(slug);
};