import { useEffect } from "react";
import Chart from "@/components/Chart";

function App() {
  useEffect(() => {
    console.log("hello");
  }, []);
  return (
    <div>
      <h1>Hello</h1>
      <div>
        <Chart />
      </div>
    </div>
  );
}

export default App;
