import * as d3 from "d3";
import type { FeatureByGroup, FeatureGroupOpt, StockData } from "@/apis/stock";
import type { PriceChartType } from "@/atoms/stocks";
import CandleStick from "@/components/plot/CandleSticks";
import XAxis from "@/components/plot/XAxis";
import YAxis from "@/components/plot/YAxis";
import TrendLine from "@/components/plot/StockTrendLine";
import MALines from "@/components/plot/price-momentum/MALines";
import StockDataIndicators from "@/components/plot/StockDataIndicators";
import MAIndicators from "@/components/plot/price-momentum/MAIndicators";
import { getHoverPlotFn, getLeavePlotFn } from "./interactions/hover";
import { plotSizeConfig } from "@/components/plot/theme";
import { useAtomValue } from "jotai";
import { plotConfigAtom } from "@/atoms/plot";
import TurnoverBars from "./market-activity/TurnoverBars";

type StockDataPlotProps = {
  data: StockData<FeatureGroupOpt>;
  chartType: PriceChartType;
  featureGroup: FeatureGroupOpt;
  width: number;
  height: number;
  maxXTickNum?: number;
};

export default function StockDataPlot({
  data,
  chartType,
  featureGroup,
  width,
  height,
  maxXTickNum = 30,
}: StockDataPlotProps) {
  const { stock, features } = data;
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;
  const plotConfig = useAtomValue(plotConfigAtom);

  // x-axis mapper
  const x = d3
    .scaleBand(
      stock.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  const xSteps = Math.floor(stock.length / maxXTickNum);
  const xLabels = stock
    .filter((_, i) => (stock.length - 1 - i) % xSteps == 0)
    .map((d) => d.tradeDate);
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  // controls hover-based indicators
  const onPointerMove = getHoverPlotFn({
    data,
    featureGroup,
    width,
    referenceHeight: plotConfig.referenceHeight,
  });

  const onPointerLeave = getLeavePlotFn({
    data,
    featureGroup,
    width,
    referenceHeight: plotConfig.referenceHeight,
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="overflow-visible cursor-crosshair"
    >
      {/* y axis marks */}
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPrefix="$"
      />
      {/* x axis marks */}
      <XAxis labels={xLabels} x={x} xPos={0} yPos={height - marginBottom} />
      {/* price trend */}
      {featureGroup === "priceMomentum" && (
        <MALines
          features={features as FeatureByGroup["priceMomentum"][]}
          x={x}
          y={y}
          yAxisMin={marginTop}
          yAxisMax={height - marginBottom}
        />
      )}
      {featureGroup === "marketActivity" && <TurnoverBars stock={stock} x={x} y={y} />}
      {chartType === "candle" && <CandleStick prices={stock} x={x} y={y} />}
      {chartType === "line" && <TrendLine prices={stock} x={x} y={y} />}
      <StockDataIndicators
        stock={stock}
        chartType={chartType}
        width={width}
        height={height}
        y={y}
      />
      {featureGroup === "priceMomentum" && (
        <MAIndicators
          features={features as FeatureByGroup["priceMomentum"][]}
          chartType={chartType}
        />
      )}
    </svg>
  );
}
