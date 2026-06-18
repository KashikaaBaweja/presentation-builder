import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const SignupForm = nextDynamic(() => import("./SignupForm"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-full items-center justify-center bg-paper text-sm text-muted-500">
      Loading…
    </div>
  ),
});

export default function SignupPage() {
  return <SignupForm />;
}
