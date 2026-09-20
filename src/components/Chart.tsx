import { useGetStockQuery } from "@/hooks/queries/useGetStockQuery";
import StockDataPlot from "@/components/StockDataPlot";

export default function Chart() {
  const { data } = useGetStockQuery("AAPL", "Days60");

  return (
    <div>
      <h2 className="font-medium mb-2">stock price trend</h2>
      <div className="border border-gray-300 rounded-xl px-6 py-2 w-fit">
        {data && <StockDataPlot data={data} />}
      </div>
    </div>
  );
}
