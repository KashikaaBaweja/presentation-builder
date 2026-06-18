"use client";

import nextDynamic from "next/dynamic";
import { Suspense } from "react";

const LoginForm = nextDynamic(() => import("./LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-full items-center justify-center bg-paper text-sm text-muted-500">
      Loading…
    </div>
  ),
});

export default function LoginPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center bg-paper text-sm text-muted-500">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
