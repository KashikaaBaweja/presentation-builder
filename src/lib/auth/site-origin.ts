/**
 * Canonical site origin for OAuth redirects.
 * Prefer NEXT_PUBLIC_SITE_URL on Vercel so redirects never fall back to localhost.
 */
export function getSiteOrigin(fallbackOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // ignore invalid URL
    }
  }

  if (fallbackOrigin) {
    return fallbackOrigin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
}
