import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="w-full h-full flex flex-col items-center gap-2 min-h-200 [&_div]:min-h-0">
      <Header />
      <div className="w-full flex-1 flex justify-center gap-2 px-4 max-w-[1800px]">
        <Outlet />
      </div>
    </div>
  );
}
