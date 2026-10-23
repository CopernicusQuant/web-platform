import {
  getStockFeatures,
  getStockInfo,
  getStockList,
  getStockPrices,
  type DataWindowOpt,
  type FeatureGroupOpt,
} from "@/apis";
import { queryOptions } from "@tanstack/react-query";

const stockInfoQuery = (ticker: string) => {
  return queryOptions({
    queryKey: ["stock", ticker, "info"],
    queryFn: async ({ signal }) => {
      return getStockInfo(ticker, signal);
    },
    staleTime: Infinity,
  });
};

const stockPriceQuery = (ticker: string, window: DataWindowOpt) => {
  return queryOptions({
    queryKey: ["stock", ticker, "prices", window],
    queryFn: async ({ signal }) => {
      return getStockPrices(ticker, window, signal);
    },
    staleTime: Infinity,
  });
};

const stockFeatureQuery = (
  ticker: string,
  window: DataWindowOpt,
  featureGroup: FeatureGroupOpt,
) => {
  return queryOptions({
    queryKey: ["stock", ticker, "features", window, featureGroup],
    queryFn: ({ signal }) => getStockFeatures(ticker, window, featureGroup, signal),
    staleTime: Infinity,
  });
};

const stockListQuery = () => {
  return queryOptions({
    queryKey: ["stock", "list"],
    queryFn: ({ signal }) => getStockList(signal),
    staleTime: Infinity,
  });
};

export { stockInfoQuery, stockListQuery, stockPriceQuery, stockFeatureQuery };
