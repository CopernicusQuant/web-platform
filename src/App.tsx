import { useEffect } from "react";
import PriceChart from "@/components/PriceChart";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    console.log("hello");
  }, []);
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <Header />
      <div className="w-full max-w-360">
        <div>
          <h2 className="font-semibold text-lg">AAPL</h2>
        </div>
        <PriceChart />
      </div>
    </div>
  );
}

export default App;
