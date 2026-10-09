import { getStockData, type DataWindowOpt, type FeatureGroupOpt } from "@/apis";
import { useQuery } from "@tanstack/react-query";

const useGetStockQuery = (
  ticker: string,
  window: DataWindowOpt,
  featureGroup: FeatureGroupOpt,
) => {
  const query = useQuery({
    queryKey: [ticker, window, featureGroup],
    queryFn: async ({ signal }) => {
      return getStockData(ticker, window, featureGroup, signal);
    },
    staleTime: Infinity,
  });
  return query;
};

export { useGetStockQuery };
