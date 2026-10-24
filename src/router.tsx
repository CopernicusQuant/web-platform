import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { AppRouterContext } from "./routes/__root";

export const queryClient = new QueryClient();
export const router = createRouter({
  routeTree,
  context: { queryClient, auth: undefined! as AppRouterContext["auth"] },
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
