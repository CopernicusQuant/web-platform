import { useState, useRef, useLayoutEffect } from "react";
import { useAtom } from "jotai";
import { dataWindow, type DataWindowOpt } from "@/apis/stock";
import {
  priceChartTypeAtom,
  stockSelectionAtom,
  type PriceChartType,
} from "@/atoms/stocks";
import { cn } from "@/lib/utils";
import { useGetStockQuery } from "@/hooks/queries/useGetStockQuery";
import StockDataPlot from "@/components/plot/StockDataPlot";
import CandleIcon from "@/components/plot/CandleIcon";
import LineIcon from "@/components/plot/LineIcon";
import clsx from "clsx";

const priceChartTypes: PriceChartType[] = ["candle", "line"];

const styles = {
  selector: clsx(
    "flex items-center border rounded-md text-sm border-gray-300 [&>button]:border-r [&>*:last-child]:border-0 overflow-hidden",
  ),
  selectorButtonBase: clsx(
    "flex justify-center items-center w-8 box-content cursor-pointer border-gray-300",
  ),
};

export default function PriceChart() {
  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState<number>(0);
  const [chartType, setChartType] = useAtom(priceChartTypeAtom);

  const [stockSelection, setStockSelection] = useAtom(stockSelectionAtom);
  const updateWindow = (newWindow: DataWindowOpt) => {
    setStockSelection((prev) => ({ ...prev, window: newWindow }));
  };

  const { data } = useGetStockQuery(stockSelection.ticker, stockSelection.window);

  useLayoutEffect(() => {
    const container = plotContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      setPlotWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className="font-medium">price trend</h2>
        <div className="flex items-center gap-6">
          <div className={styles.selector}>
            {priceChartTypes.map((currType) => (
              <button
                key={`selector-button-${currType}`}
                className={cn(
                  styles.selectorButtonBase,
                  chartType === currType ? "bg-black" : "bg-white",
                )}
                onClick={() => setChartType(currType)}
              >
                {currType === "line" ? (
                  <LineIcon stroke={chartType === currType ? "white" : "black"} />
                ) : (
                  <CandleIcon stroke={chartType === currType ? "white" : "black"} />
                )}
              </button>
            ))}
          </div>
          {/* Data window selector */}
          <div className={styles.selector}>
            {Object.entries(dataWindow).map(([key]) => (
              <button
                key={key}
                className={cn(
                  styles.selectorButtonBase,
                  "px-2 py-1 text-xs cursor-pointer tracking-tight",
                  key === stockSelection.window ? "text-white bg-black" : "",
                )}
                onClick={() => updateWindow(key as DataWindowOpt)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={plotContainerRef}
        className="border border-gray-300 rounded-md px-6 py-2 w-full"
      >
        {data && <StockDataPlot data={data} chartType={chartType} width={plotWidth} />}
      </div>
    </div>
  );
}
