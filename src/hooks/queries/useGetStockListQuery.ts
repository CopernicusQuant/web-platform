import { getStockList } from "@/apis/stock_list";
import { useQuery } from "@tanstack/react-query";

const useGetStockListQuery = () => {
  const query = useQuery({
    queryKey: ["stocklist"],
    queryFn: async ({ signal }) => {
      return getStockList(signal);
    },
    staleTime: Infinity,
  });
  return query;
};

export { useGetStockListQuery };
