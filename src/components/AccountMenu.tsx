"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function AccountMenu({
  email,
  isAdmin = false,
}: {
  email: string;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-[12rem] items-center gap-2 rounded-xl border border-muted-200 px-3 py-1.5 text-xs font-medium text-muted-700 transition-colors hover:bg-muted-50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white"
          aria-hidden
        >
          {email.charAt(0).toUpperCase()}
        </span>
        <span className="truncate">{email}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-muted-200 bg-white py-1 shadow-lg"
        >
          <p className="truncate px-3 py-2 text-xs text-muted-400">{email}</p>
          <div className="my-1 border-t border-muted-100" />
          {isAdmin && (
            <Link
              href="/admin"
              role="menuitem"
              className="block px-3 py-2 text-sm text-muted-700 hover:bg-muted-50"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          )}
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
            >
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
