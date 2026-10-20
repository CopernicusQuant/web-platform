// import { useGetStockQuery } from "@/hooks/queries/useGetStockPriceQuery";
import PriceSection from "@/components/PriceSection";
import Header from "@/components/Header";
import StockInfo from "@/components/StockInfo";
import FeaturesSection from "@/components/FeaturesSection";
import FeatureGroupSidebar from "@/components/FeatureGroupSidebar";
import "@/i18n/i18n";

function App() {
  return (
    <div className="w-full h-full flex flex-col items-center gap-2 min-h-200 [&_div]:min-h-0">
      <Header />
      <div className="w-full flex-1 flex justify-center gap-2 px-4 max-w-[1800px]">
        <div className="w-full flex-1 py-4 min-w-0 flex flex-col gap-3">
          <StockInfo />
          <div className="flex-1 flex flex-col gap-3">
            <PriceSection className="flex flex-col flex-3" />
            <FeaturesSection className="flex flex-col flex-2" />
          </div>
        </div>
        <div className="min-w-70 w-70 py-4">
          <FeatureGroupSidebar />
        </div>
      </div>
    </div>
  );
}

export default App;
