import { applySecurityHeaders } from "@/lib/auth/security-headers";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

const PROTECTED_PREFIXES = ["/editor", "/decks", "/admin"];
const AUTH_PAGES = ["/login", "/signup"];
const API_AUTH_PREFIXES = ["/api/generate"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAuthPage(pathname: string) {
  return AUTH_PAGES.includes(pathname);
}

function isAuthRequiredApi(pathname: string) {
  return API_AUTH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function redirectWithSecurity(
  request: NextRequest,
  pathname: string,
  searchParams?: Record<string, string>
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      url.searchParams.set(key, value);
    }
  }
  return applySecurityHeaders(NextResponse.redirect(url));
}

export async function updateSession(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Supabase may redirect to Site URL (/) with ?code= instead of /auth/callback
  if (
    pathname !== "/auth/callback" &&
    (searchParams.has("code") || searchParams.has("error"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/callback";
    return applySecurityHeaders(NextResponse.redirect(url));
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            sameSite: options?.sameSite ?? "lax",
            secure: options?.secure ?? process.env.NODE_ENV === "production",
          })
        );

        if (headers) {
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        }
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    error &&
    (error.code === "refresh_token_not_found" ||
      error.code === "session_not_found" ||
      error.message.includes("Refresh Token"))
  ) {
    await supabase.auth.signOut();
  }

  if (isAuthRequiredApi(pathname) && !user) {
    return applySecurityHeaders(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
  }

  if (isProtectedPath(pathname) && !user) {
    return redirectWithSecurity(request, "/login", { next: pathname });
  }

  if (pathname.startsWith("/admin") && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return redirectWithSecurity(request, "/");
    }
  }

  if (isAuthPage(pathname) && user) {
    const next = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));
    return redirectWithSecurity(request, next);
  }

  return applySecurityHeaders(supabaseResponse);
}
