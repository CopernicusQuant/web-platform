import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { queryClient, router } from "./router.tsx";
import { ClerkProvider, useAuth } from "@clerk/react";
import "@/i18n/i18n";
import "./index.css";

function AppRouter() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  if (!isLoaded) {
    return <></>; // probably could be an animation here
  }
  return (
    <RouterProvider
      router={router}
      context={{
        queryClient: queryClient,
        auth: { isSignedIn: Boolean(isSignedIn), getToken },
      }}
    />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider>
      <AppRouter />
    </ClerkProvider>
  </StrictMode>,
);
