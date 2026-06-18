import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
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
