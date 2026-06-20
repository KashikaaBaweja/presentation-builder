import { DEFAULT_REDIRECT, getSafeRedirectPath } from "@/lib/auth/safe-redirect";

export function buildOAuthCallbackUrl(
  origin: string,
  next?: string | null
): string {
  const safePath = getSafeRedirectPath(next);
  const callback = new URL("/auth/callback", origin);

  if (safePath !== DEFAULT_REDIRECT) {
    callback.searchParams.set("next", safePath);
  }

  return callback.toString();
}
