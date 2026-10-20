import { getStockPrices, type DataWindowOpt } from "@/apis";
import { useQuery } from "@tanstack/react-query";

const useGetStockPriceQuery = (ticker: string, window: DataWindowOpt) => {
  const query = useQuery({
    queryKey: [ticker, window],
    queryFn: async ({ signal }) => {
      return getStockPrices(ticker, window, signal);
    },
    staleTime: Infinity,
  });
  return query;
};

export { useGetStockPriceQuery };
