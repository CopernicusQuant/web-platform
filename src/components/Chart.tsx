import { useGetStockQuery } from "@/hooks/queries/useGetStockQuery";
import StockDataPlot from "@/components/StockDataPlot";

export default function Chart() {
  const { data } = useGetStockQuery("GOOG", "Days60");
  return <div>{data && <StockDataPlot data={data} />}</div>;
}
