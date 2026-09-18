import { useEffect } from "react";
import Chart from "@/components/chart";

function App() {
  useEffect(() => {
    console.log("hello");
  }, []);
  return (
    <div>
      <h1>Hello</h1>
      <Chart />
    </div>
  );
}

export default App;
