import { dataWindows, FeatureGroups } from "@/apis";
import StockInfo from "@/components/StockInfo";
import {
  stockFeatureQuery,
  stockInfoQuery,
  stockListQuery,
  stockPriceQuery,
} from "@/queries/stock";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import PriceSection from "@/components/PriceSection";
import FeaturesSection from "@/components/FeaturesSection";

const searchSchema = z.object({
  window: z.enum(dataWindows).catch("60D"),
  featureGroup: z.enum(FeatureGroups).catch("priceMomentum"),
});

export type StockSearchSchema = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/stocks/$ticker")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    window: search.window,
    featureGroup: search.featureGroup,
  }),
  loader: async ({ context, params, deps }) => {
    const [info, list, prices, features] = await Promise.all([
      context.queryClient.query(stockInfoQuery(params.ticker)),
      context.queryClient.query(stockListQuery()),
      context.queryClient.query(stockPriceQuery(params.ticker, deps.window)),
      context.queryClient.query(
        stockFeatureQuery(params.ticker, deps.window, deps.featureGroup),
      ),
    ]);
    return { info, list, prices, features };
  },
  component: StocksDashboard,
});

function StocksDashboard() {
  return (
    <div className="w-full flex-1 py-4 min-w-0 flex flex-col gap-3">
      <StockInfo />
      <div className="flex-1 flex flex-col gap-3">
        <PriceSection className="flex flex-col flex-3" />
        <FeaturesSection className="flex flex-col flex-2" />
      </div>
    </div>
  );
}
