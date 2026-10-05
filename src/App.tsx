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
    <div className="w-full h-full flex flex-col items-center gap-2 min-h-180">
      <Header />
      <div className="w-full flex-1 flex justify-center gap-2 px-4 max-w-[1800px]">
        <div className="w-full flex-1 py-4 min-w-0 flex flex-col gap-3">
          <StockInfo />
          <div className="flex-1 flex flex-col gap-3">
            <PriceSection stockData={data} className="flex flex-col flex-3" />
            <FeaturesSection stockData={data} className="flex flex-col flex-2" />
          </div>
        </div>
        <div className="min-w-72 w-72 py-4">
          <div className="w-full h-full bg-white rounded-md border-gray-300 border"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
