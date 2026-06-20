"use client";

import {
  AuthCard,
  AuthDivider,
  AuthError,
  AuthField,
  AuthLink,
  AuthSubmit,
} from "@/components/auth/AuthCard";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { getSafeRedirectPath } from "@/lib/auth/safe-redirect";
import { normalizeAuthEmail } from "@/lib/auth/password";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = getSafeRedirectPath(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured for this deployment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY on Vercel, then redeploy."
      );
      return;
    }

    const callbackError = searchParams.get("error");
    if (callbackError) {
      setError(decodeURIComponent(callbackError));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizeAuthEmail(email),
        password,
      });

      if (signInError) {
        setError(formatAuthError(signInError));
        return;
      }

      window.location.href = next;
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to edit and export your presentations."
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/signup">Sign up</AuthLink>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <GoogleSignInButton
          next={next}
          disabled={!isSupabaseConfigured()}
        />
        <AuthDivider />
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthError message={error} />
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        <AuthSubmit loading={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </AuthSubmit>
        </form>
      </div>
    </AuthCard>
  );
}
