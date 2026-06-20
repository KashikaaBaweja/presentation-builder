"use client";

import { ToolbarButton } from "@/components/toolbar/ToolbarPrimitives";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function EditorMenu({
  isAdmin,
  onReset,
  onGenerate,
}: {
  isAdmin: boolean;
  onReset: () => void;
  onGenerate: () => void;
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
      <ToolbarButton
        active={open}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        title="More options"
        className="px-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </ToolbarButton>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-muted-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onGenerate();
              setOpen(false);
            }}
            className="flex w-full px-3 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
          >
            Generate from topic
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              if (window.confirm("Reset this presentation to the default deck?")) {
                onReset();
              }
              setOpen(false);
            }}
            className="flex w-full px-3 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
          >
            Reset presentation
          </button>
          {isAdmin && (
            <>
              <div className="my-1 border-t border-muted-100" />
              <Link
                href="/admin"
                role="menuitem"
                className="block px-3 py-2 text-sm text-muted-700 hover:bg-muted-50"
                onClick={() => setOpen(false)}
              >
                Admin dashboard
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
