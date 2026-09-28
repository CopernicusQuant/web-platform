import PriceSection from "@/components/PriceSection";
import Header from "@/components/Header";
import StockInfo from "@/components/StockInfo";

function App() {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Header />
      <div className="w-full max-w-360 p-4 flex flex-col gap-4">
        <StockInfo />
        <PriceSection />
      </div>
    </div>
  );
}

export default App;
