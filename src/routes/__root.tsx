import { Outlet, createRootRouteWithContext, redirect } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

export type AppRouterContext = {
  queryClient: QueryClient;
  auth: {
    isSignedIn: boolean;
    getToken: () => Promise<string | null>;
  };
};

const publicPaths = new Set([
  "/signin",
  // /signup,
  // /forget-password
]);

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isSignedIn && !publicPaths.has(location.pathname)) {
      throw redirect({
        to: "/signin",
        search: { redirect: location.href },
        replace: true,
      });
    }
  },
  component: RootLayout,
});

function RootLayout() {
  return <Outlet />;
}
