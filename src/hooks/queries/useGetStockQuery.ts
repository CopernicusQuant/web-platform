import { getStockData, type DataWindowOpt } from "@/apis/stock";
import { useQuery } from "@tanstack/react-query";

const useGetStockQuery = (ticker: string, window: DataWindowOpt) => {
  const query = useQuery({
    queryKey: [ticker, window],
    queryFn: async ({ signal }) => {
      return getStockData(ticker, window, signal);
    },
    staleTime: Infinity,
  });
  return query;
};

export { useGetStockQuery };
