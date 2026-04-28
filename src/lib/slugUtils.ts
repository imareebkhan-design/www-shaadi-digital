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
  if (!slug || typeof slug !== "string") return "";

  const format = (value: string) =>
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\+/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  try {
    const decoded = decodeURIComponent(slug);
    return format(decoded);
  } catch {
    return format(slug);
  }
};

/**
 * Validate slug format
 */
export const isValidSlug = (slug: string): boolean => {
  if (!slug || typeof slug !== "string") return false;
  if (slug.length < 2 || slug.length > 200) return false;

  const validSlugRegex = /^[a-z0-9-]+$/;
  return validSlugRegex.test(slug);
};