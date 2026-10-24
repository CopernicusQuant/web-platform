import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/stocks")({
  component: StocksLayout,
});

function StocksLayout() {
  return (
    <div className="w-full h-full flex flex-col items-center gap-3 min-h-200 [&_div]:min-h-0">
      <Header />
      <div className="w-full flex-1 px-3 max-w-(--max-width)">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
