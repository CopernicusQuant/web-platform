import { useAtom, useSetAtom } from "jotai";
import {
  dataWindow,
  type DataWindowOpt,
  type FeatureGroupOpt,
  type StockData,
} from "@/apis/stock";
import {
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
import { usePlotSize } from "@/hooks/usePlotSize";
import { plotConfigAtom } from "@/atoms/plot";
import { useEffect } from "react";

const priceChartTypes: PriceChartType[] = ["candle", "line"];

type PriceChartProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
} & React.ComponentPropsWithoutRef<"div">;

export default function PriceChart({ stockData, ...props }: PriceChartProps) {
  const [chartType, setChartType] = useAtom(priceChartTypeAtom);

  const [stockSelection, setStockSelection] = useAtom(stockSelectionAtom);
  const updateWindow = (newWindow: DataWindowOpt) => {
    setStockSelection((prev) => ({ ...prev, window: newWindow }));
  };
  const { plotSize, plotContainerRef } = usePlotSize();
  const setPlotConfig = useSetAtom(plotConfigAtom);

  useEffect(
    () => setPlotConfig((prev) => ({ ...prev, referenceHeight: plotSize.height })),
    [plotSize.height, setPlotConfig],
  );

  return (
    <Section {...props}>
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
      <Content ref={plotContainerRef} className="flex-1">
        {stockData && (
          <StockDataPlot
            data={stockData}
            chartType={chartType}
            featureGroup={stockSelection.featureGroup}
            width={plotSize.width}
            height={plotSize.height}
          />
        )}
      </Content>
    </Section>
  );
}
