"use client";

import { AccountMenu } from "@/components/AccountMenu";
import { AppLogo } from "@/components/AppLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/presentations", label: "Presentations" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-muted-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-muted-200 bg-white">
        <div className="border-b border-muted-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <AppLogo size={32} />
            <div>
              <p className="font-heading text-sm font-semibold text-ink">
                Admin Console
              </p>
              <p className="text-[11px] text-muted-400">Presentation Builder</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-muted-600 hover:bg-muted-50 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-muted-100 p-4">
          <Link
            href="/decks"
            className="block rounded-xl px-3 py-2.5 text-sm font-medium text-muted-600 transition-colors hover:bg-muted-50 hover:text-ink"
          >
            ← Back to app
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-muted-200 bg-white px-8 py-4">
          <p className="text-sm text-muted-500">
            Signed in as admin
          </p>
          <AccountMenu email={email} isAdmin />
        </header>
        <main className="flex-1 overflow-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-500">
        {description}
      </p>
    </div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-muted-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-400">
        {label}
      </p>
      <p className="font-heading mt-2 text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-500">{hint}</p>}
    </div>
  );
}
