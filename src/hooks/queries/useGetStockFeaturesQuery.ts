import { getStockFeatures, type DataWindowOpt, type FeatureGroupOpt } from "@/apis";
import { useQuery } from "@tanstack/react-query";

const useGetStockFeaturesQuery = (
  ticker: string,
  window: DataWindowOpt,
  featureGroup: FeatureGroupOpt,
) => {
  const query = useQuery({
    queryKey: [ticker, window, featureGroup],
    queryFn: async ({ signal }) => {
      return getStockFeatures(ticker, window, featureGroup, signal);
    },
    staleTime: Infinity,
  });
  return query;
};

export { useGetStockFeaturesQuery };
