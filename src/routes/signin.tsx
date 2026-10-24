import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SignIn />
    </div>
  );
}
