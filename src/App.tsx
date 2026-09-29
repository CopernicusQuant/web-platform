import PriceSection from "@/components/PriceSection";
import Header from "@/components/Header";
import StockInfo from "@/components/StockInfo";
import FeaturesSection from "@/components/FeaturesSection";
import { stockSelectionAtom } from "@/atoms/stocks";

import { useGetStockQuery } from "@/hooks/queries/useGetStockQuery";
import { useAtomValue } from "jotai";
function App() {
  const stockSelection = useAtomValue(stockSelectionAtom);
  const { data } = useGetStockQuery(
    stockSelection.ticker,
    stockSelection.window,
    stockSelection.featureGroup,
  );
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Header />
      <div className="w-full max-w-360 p-4 flex flex-col gap-3">
        <StockInfo />
        <PriceSection stockData={data} />
        <FeaturesSection stockData={data} />
      </div>
    </div>
  );
}

export default App;
