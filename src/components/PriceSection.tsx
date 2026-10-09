import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import {
  dataWindowParam,
  type DataWindowOpt,
  type FeatureGroupOpt,
  type StockData,
} from "@/apis";
import {
  priceChartTypeAtom,
  setStockWindowAtom,
  stockSelectionAtom,
  type PriceChartType,
} from "@/atoms/stocks";
import { plotConfigAtom } from "@/atoms/plot";
import { usePlotSize } from "@/hooks/usePlotSize";
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

const priceChartTypes: PriceChartType[] = ["candle", "line"];

type PriceChartProps = {
  stockData: StockData<FeatureGroupOpt> | undefined;
} & React.ComponentPropsWithoutRef<"div">;

export default function PriceChart({ stockData, ...props }: PriceChartProps) {
  const [chartType, setChartType] = useAtom(priceChartTypeAtom);

  const { window, featureGroup } = useAtomValue(stockSelectionAtom);
  const setStockWindow = useSetAtom(setStockWindowAtom);

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
          {Object.entries(dataWindowParam).map(([key]) => (
            <Button
              key={`selector-button-${key}`}
              active={key === window}
              className={"w-11"}
              onClick={() => setStockWindow(key as DataWindowOpt)}
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
            featureGroup={featureGroup}
            width={plotSize.width}
            height={plotSize.height}
          />
        )}
      </Content>
    </Section>
  );
}
