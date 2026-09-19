import { useEffect } from "react";
import Chart from "@/components/Chart";
import Header from "./components/Header";

function App() {
  useEffect(() => {
    console.log("hello");
  }, []);
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <Header />
      <div>
        <h2 className="font-semibold text-lg">AAPL</h2>
      </div>
      <Chart />
    </div>
  );
}

export default App;
