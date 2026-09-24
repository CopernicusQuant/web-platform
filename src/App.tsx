import { useEffect } from "react";
import PriceChart from "@/components/PriceChart";
import Header from "@/components/Header";
import StockInfo from "@/components/StockInfo";

function App() {
  useEffect(() => {
    console.log("hello");
  }, []);
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <Header />
      <div className="w-full max-w-360 p-4 flex flex-col gap-4">
        <StockInfo />
        <PriceChart />
      </div>
    </div>
  );
}

export default App;
