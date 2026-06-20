import Link from "next/link";

export function AdminHeaderLink() {
  return (
    <Link
      href="/admin"
      className="rounded-lg border border-muted-200 px-3 py-1.5 text-xs font-medium text-muted-600 hover:bg-muted-50"
    >
      Admin
    </Link>
  );
}
