import { dataWindows, FeatureGroups } from "@/apis";
import StockInfo from "@/components/StockInfo";
import {
  stockFeatureQuery,
  stockInfoQuery,
  stockListQuery,
  stockPriceQuery,
} from "@/queries/stock";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { z } from "zod";
import PriceSection from "@/components/PriceSection";
import FeaturesSection from "@/components/FeaturesSection";
import FeatureGroupSidebar from "@/components/FeatureGroupSidebar";

const searchSchema = z.object({
  window: z.enum(dataWindows).catch("60D"),
  group: z.enum(FeatureGroups).catch("pricemomentum"),
});

export type StockSearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/stocks/$ticker")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    window: search.window,
    group: search.group,
  }),
  loader: async ({ context, params, deps }) => {
    const [info, list, prices, features] = await Promise.all([
      context.queryClient.query(stockInfoQuery(params.ticker)),
      context.queryClient.query(stockListQuery()),
      context.queryClient.query(stockPriceQuery(params.ticker, deps.window)),
      context.queryClient.query(
        stockFeatureQuery(params.ticker, deps.window, deps.group),
      ),
    ]);
    return { info, list, prices, features };
  },
  component: StocksDashboard,
});

export const stockRouteAPI = getRouteApi("/stocks/$ticker");

function StocksDashboard() {
  return (
    <div className="w-full h-full flex justify-center gap-2">
      <div className="w-full flex-1 min-w-0 flex flex-col gap-2">
        <StockInfo />
        <div className="flex-1 flex flex-col gap-2">
          <PriceSection className="flex flex-col flex-3" />
          <FeaturesSection className="flex flex-col flex-2" />
        </div>
      </div>
      <div className="min-w-70 w-70">
        <FeatureGroupSidebar />
      </div>
    </div>
  );
}
