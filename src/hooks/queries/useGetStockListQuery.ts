import { getStockList } from "@/apis";
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
