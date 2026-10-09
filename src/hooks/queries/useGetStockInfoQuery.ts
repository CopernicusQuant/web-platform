import { getStockInfo } from "@/apis";
import { useQuery } from "@tanstack/react-query";

const useGetStockInfoQuery = (ticker: string) => {
  const query = useQuery({
    queryKey: ["stockinfo", ticker],
    queryFn: async ({ signal }) => {
      return getStockInfo(ticker, signal);
    },
    staleTime: Infinity,
  });
  return query;
};

export { useGetStockInfoQuery };
