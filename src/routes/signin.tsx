import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

type RedirectParam = {
  redirect: string | undefined;
};

function SignInPage() {
  const { redirect } = Route.useSearch({
    select: (search) => search as RedirectParam,
  });
  const safeRedirect =
    redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SignIn forceRedirectUrl={safeRedirect} />
    </div>
  );
}
