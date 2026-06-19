"use client";

import {
  AuthCard,
  AuthError,
  AuthField,
  AuthLink,
  AuthSubmit,
} from "@/components/auth/AuthCard";
import { MIN_PASSWORD_LENGTH, normalizeAuthEmail, validatePassword } from "@/lib/auth/password";
import { formatAuthError, isSignupEmailFailure } from "@/lib/supabase/auth-errors";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { useEffect, useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError(
        "Supabase is not configured for this deployment. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY on Vercel, then redeploy."
      );
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const normalizedEmail = normalizeAuthEmail(email);
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        if (isSignupEmailFailure(signUpError)) {
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

          if (signInData.session) {
            window.location.href = "/decks";
            return;
          }

          if (signInError?.code === "email_not_confirmed") {
            setError(formatAuthError(signUpError));
            return;
          }

          if (signInError?.code === "invalid_credentials") {
            setError("An account with this email may already exist. Try signing in instead.");
            return;
          }
        }

        setError(formatAuthError(signUpError));
        return;
      }

      if (data.session) {
        window.location.href = "/decks";
        return;
      }

      setMessage("Check your email to confirm your account, then sign in.");
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create an account"
      subtitle="Start building polished slide decks in minutes."
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthError message={error} />
        {message && (
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-ink">
            {message}
          </p>
        )}
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
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
        />
        <AuthSubmit loading={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </AuthSubmit>
      </form>
    </AuthCard>
  );
}
