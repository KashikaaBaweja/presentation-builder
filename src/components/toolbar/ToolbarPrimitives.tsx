import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ToolbarLabel({ children }: { children: ReactNode }) {
  return (
    <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted-400">
      {children}
    </span>
  );
}

export function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-muted-200" aria-hidden />;
}

export function ToolbarGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex shrink-0 items-center gap-1.5 ${className}`}>
      {children}
    </div>
  );
}

export function ToolbarShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-lg border border-muted-200/80 bg-white p-0.5 shadow-sm">
      {children}
    </div>
  );
}

type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  variant?: "ghost" | "solid";
};

export function ToolbarButton({
  active = false,
  variant = "ghost",
  className = "",
  children,
  ...props
}: ToolbarButtonProps) {
  const base =
    "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const styles =
    variant === "solid"
      ? "bg-muted-900 text-white hover:bg-muted-800"
      : active
        ? "bg-muted-100 text-muted-900"
        : "text-muted-600 hover:bg-muted-50 hover:text-muted-900";

  return (
    <button type="button" className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ToolbarSelect({
  value,
  onChange,
  children,
  "aria-label": ariaLabel,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  "aria-label": string;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={`h-8 min-w-[9rem] shrink-0 cursor-pointer truncate rounded-md border border-muted-200 bg-white px-2.5 text-xs font-medium text-muted-800 shadow-sm outline-none hover:border-muted-300 focus:border-muted-400 ${className}`}
    >
      {children}
    </select>
  );
}

export function ToolbarSegmented({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string; title?: string }[];
  "aria-label": string;
}) {
  return (
    <div
      className="flex items-center rounded-md bg-muted-100/80 p-0.5"
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          title={option.title}
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={`min-w-7 rounded px-2 py-1 text-[11px] font-semibold transition-colors ${
            value === option.id
              ? "bg-white text-muted-900 shadow-sm"
              : "text-muted-500 hover:text-muted-700"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
