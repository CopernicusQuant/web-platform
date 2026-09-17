import { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("hello");
  }, []);
  return <h1>Hello</h1>;
}

export default App;
