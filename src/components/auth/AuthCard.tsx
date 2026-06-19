import { AppLogo } from "@/components/AppLogo";
import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-paper px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <AppLogo size={40} />
        <span className="font-heading text-lg font-semibold text-ink">
          Presentation Builder
        </span>
      </div>

      <div className="w-full max-w-md rounded-2xl border border-muted-200 bg-white p-8 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-muted-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>

      <p className="mt-6 text-sm text-muted-500">{footer}</p>
    </div>
  );
}

export function AuthField({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-muted-200 bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
    </div>
  );
}

export function AuthSubmit({
  children,
  loading,
}: {
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function AuthError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="font-medium text-accent hover:underline">
      {children}
    </Link>
  );
}
