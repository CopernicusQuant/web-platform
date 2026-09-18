import { useGetStockQuery } from "@/hooks/queries/useGetStockQuery";

export default function Chart() {
  const { data, isLoading, isError, error } = useGetStockQuery("AAPL", "Days30");

  console.log(isLoading);
  console.log(data);
  if (isError) {
    console.log(error);
  }
  return <div>This is the chart</div>;
}
