import { useRef, useLayoutEffect } from "react";
import { useAtom } from "jotai";
import {
  dataWindow,
  type DataWindowOpt,
  type FeatureGroupOpt,
  type StockData,
} from "@/apis/stock";
import {
  plotWidthAtom,
  priceChartTypeAtom,
  stockSelectionAtom,
  type PriceChartType,
} from "@/atoms/stocks";
import {
  Section,
  Content,
  Header,
  Selections,
  Button,
} from "@/components/ui/PlotSection";
import StockDataPlot from "@/components/plot/StockDataPlot";
import CandleIcon from "@/components/icons/CandleIcon";
import LineIcon from "@/components/icons/LineIcon";
import { plotSizeConfig } from "./plot/theme";

const priceChartTypes: PriceChartType[] = ["candle", "line"];

type PriceChartProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
};

export default function PriceChart({ stockData }: PriceChartProps) {
  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useAtom(plotWidthAtom);
  const [chartType, setChartType] = useAtom(priceChartTypeAtom);

  const [stockSelection, setStockSelection] = useAtom(stockSelectionAtom);
  const updateWindow = (newWindow: DataWindowOpt) => {
    setStockSelection((prev) => ({ ...prev, window: newWindow }));
  };

  useLayoutEffect(() => {
    const container = plotContainerRef.current;
    if (!container) return;
    if (plotWidth === 0) {
      const width = Math.round(container.getBoundingClientRect().width);
      setPlotWidth(width);
    }
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = Math.round(entry.contentRect.width);
      setPlotWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    });
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section>
      <Header title={"price trend"}>
        <Selections>
          {priceChartTypes.map((currType) => (
            <Button
              key={`selector-button-${currType}`}
              active={chartType === currType}
              onClick={() => setChartType(currType)}
            >
              {currType === "line" ? <LineIcon /> : <CandleIcon />}
            </Button>
          ))}
        </Selections>
        {/* Data window selector */}
        <Selections>
          {Object.entries(dataWindow).map(([key]) => (
            <Button
              key={`selector-button-${key}`}
              active={key === stockSelection.window}
              className={"w-11"}
              onClick={() => updateWindow(key as DataWindowOpt)}
            >
              {key}
            </Button>
          ))}
        </Selections>
      </Header>
      <Content
        ref={plotContainerRef}
        style={{ height: plotSizeConfig.pricePlotHeight + 8 * 2 }}
      >
        {stockData && (
          <StockDataPlot
            data={stockData}
            chartType={chartType}
            featureGroup={stockSelection.featureGroup}
            width={plotWidth}
          />
        )}
      </Content>
    </Section>
  );
}
