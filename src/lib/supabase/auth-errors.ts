/** Turn Supabase auth errors into user-readable messages. */
export function isSignupEmailFailure(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as { message?: string; code?: string; msg?: string };
  const text = record.message ?? record.msg ?? "";
  return (
    text.includes("Error sending confirmation email") ||
    record.code === "unexpected_failure"
  );
}

export function formatAuthError(error: unknown): string {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;

    const msg =
      (typeof record.msg === "string" && record.msg) ||
      (typeof record.message === "string" && record.message) ||
      (typeof record.error_description === "string" && record.error_description) ||
      (typeof record.error === "string" && record.error);

    if (msg && msg !== "{}") {
      return mapKnownAuthMessage(msg);
    }

    if (typeof record.code === "string") {
      return mapKnownAuthCode(record.code);
    }
  }

  if (error instanceof Error) {
    if (error.message && error.message !== "{}") {
      return mapKnownAuthMessage(error.message);
    }
  }

  return "Could not reach Supabase Auth. Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set on Vercel, then redeploy.";
}

function mapKnownAuthCode(code: string): string {
  switch (code) {
    case "invalid_credentials":
      return "Invalid email or password.";
    case "email_not_confirmed":
      return "Confirm your email before signing in.";
    case "user_already_exists":
      return "An account with this email already exists. Try signing in.";
    case "weak_password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return `Sign up failed (${code}). Please try again.`;
  }
}

function mapKnownAuthMessage(message: string): string {
  if (
    message === "Load failed" ||
    message.includes("Failed to fetch") ||
    message.includes("NetworkError") ||
    message.includes("Network request failed")
  ) {
    return "Could not connect to Supabase. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY on Vercel, redeploy, then try again.";
  }
  if (message.includes("Error sending confirmation email")) {
    return "Sign up needs email confirmation, but Supabase could not send the email. In Supabase → Authentication → Providers → Email, turn OFF \"Confirm email\", then try again.";
  }
  if (message.includes("Invalid API key")) {
    return "Invalid Supabase API key. Check NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY on Vercel.";
  }
  if (message.includes("No API key found")) {
    return "Supabase API key is missing. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to Vercel and redeploy.";
  }
  if (message.includes("Missing environment variable")) {
    return "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to Vercel, then redeploy.";
  }
  return message;
}
