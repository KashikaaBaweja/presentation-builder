const DEFAULT_REDIRECT = "/decks";

/**
 * Validates post-login redirect paths to prevent open redirects.
 * Allows only same-origin relative paths (single leading slash).
 */
export function getSafeRedirectPath(
  next: string | null | undefined,
  fallback = DEFAULT_REDIRECT
): string {
  if (!next) return fallback;

  const path = next.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }

  // Reject protocol-relative or scheme-like paths (e.g. /\\evil.com, /javascript:)
  if (/[:@]/.test(path.slice(1))) {
    return fallback;
  }

  return path;
}
