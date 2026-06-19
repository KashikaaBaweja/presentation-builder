"use client";

import {
  AuthCard,
  AuthError,
  AuthField,
  AuthLink,
  AuthSubmit,
} from "@/components/auth/AuthCard";
import { formatAuthError } from "@/lib/supabase/auth-errors";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(formatAuthError(signUpError));
        return;
      }

      if (data.session) {
        router.push("/decks");
        router.refresh();
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
        />
        <AuthSubmit loading={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </AuthSubmit>
      </form>
    </AuthCard>
  );
}
