import * as d3 from "d3";
import { useAtomValue } from "jotai";
import type {
  BollingerBandsFeature,
  CCIFeature,
  DEMAFeature,
  KDJFeature,
  MACDFeature,
  PriceMomentumFeature,
} from "@/apis";
import { plotConfigAtom } from "@/atoms/plot";
import XAxis from "@/components/ui/XAxis";
import YAxis from "@/components/ui/YAxis";
import TrendLine from "@plot/StockTrendLine";
import CandleStick from "@plot/CandleSticks";
import Volumes from "@plot/Volumes";
import MALines from "@plot/price-momentum/MALines";
import StockDataIndicators from "@plot/StockDataIndicators";
import MAIndicators from "@plot/price-momentum/MAIndicators";
import { getHoverPlotFn, getLeavePlotFn } from "@plot/interactions/hover";
import { plotSizeConfig } from "@plot/theme";
import TurnoverBars from "@plot/market-activity/TurnoverBars";
import CrossoverSignals from "@plot/macd/CrossoverSignals";
import EMALines from "@plot/macd/EMALines";
import MACDIndicators from "@plot/macd/MACDIndicators";
import BollingerBands from "@plot/bollinger-bands/BollingerBands";
import DEMATrendLines from "@plot/dema/DEMATrendLines";
import DEMASignals from "@plot/dema/DEMASignals";
import DEMAIndicators from "./dema/DEMAIndicators";
import KDJLowHigh from "@plot/kdj/KDJLowHigh";
import CCITpPlot from "@plot/cci/CCITpPlot";
import { stockRouteAPI } from "@/routes/stocks.$ticker";
import type { PriceChartType } from "@/components/shared";

type StockDataPlotProps = {
  chartType: PriceChartType;
  width: number;
  height: number;
  maxXTickNum?: number;
};

export default function StockDataPlot({
  chartType,
  width,
  height,
  maxXTickNum = 30,
}: StockDataPlotProps) {
  const plotConfig = useAtomValue(plotConfigAtom);
  const { prices, features } = stockRouteAPI.useLoaderData({
    select: (loaderData) => loaderData,
  });
  const featureGroup = stockRouteAPI.useSearch({
    select: (search) => search.featureGroup,
  });
  if (!prices) return <></>;
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;

  // x-axis mapper
  const x = d3
    .scaleBand(
      prices.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  const xSteps = Math.floor(prices.length / maxXTickNum);
  const xLabels = prices
    .filter((_, i) => (prices.length - 1 - i) % xSteps == 0)
    .map((d) => d.tradeDate);
  // y-axis mapper
  const yMax = d3.max(prices, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(prices, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  // controls hover-based indicators
  const onPointerMove = getHoverPlotFn({
    prices,
    features,
    featureGroup,
    width,
    referenceHeight: plotConfig.referenceHeight,
  });

  const onPointerLeave = getLeavePlotFn({
    prices,
    features,
    featureGroup,
    width,
    referenceHeight: plotConfig.referenceHeight,
  });

  const getFeaturesPlot = () => {
    switch (featureGroup) {
      case "priceMomentum":
        return <MALines features={features as PriceMomentumFeature[]} x={x} y={y} />;
      case "volumeMomentum":
      case "obv":
        return <Volumes prices={prices} x={x} y={y} />;
      case "marketActivity":
        return <TurnoverBars prices={prices} x={x} y={y} />;
      case "macd":
        return (
          <>
            <EMALines features={features as MACDFeature[]} x={x} y={y} />
            <CrossoverSignals features={features as MACDFeature[]} x={x} y={y} />
          </>
        );
      case "bollingerBands":
        return (
          <BollingerBands
            features={features as BollingerBandsFeature[]}
            x={x}
            y={y}
            chartType={chartType}
          />
        );
      case "dema":
        return (
          <>
            <DEMATrendLines
              features={features as DEMAFeature[]}
              x={x}
              y={y}
              chartType={chartType}
            />
            <DEMASignals features={features as DEMAFeature[]} x={x} y={y} />
          </>
        );
      case "kdj":
        return (
          <KDJLowHigh
            features={features as KDJFeature[]}
            chartType={chartType}
            x={x}
            y={y}
          />
        );
      case "cci":
        return (
          <CCITpPlot
            features={features as CCIFeature[]}
            chartType={chartType}
            x={x}
            y={y}
          />
        );
      default:
        return <></>;
    }
  };

  const getIndicators = () => {
    switch (featureGroup) {
      case "priceMomentum":
        return (
          <MAIndicators
            features={features as PriceMomentumFeature[]}
            chartType={chartType}
          />
        );
      case "macd":
        return (
          <MACDIndicators features={features as MACDFeature[]} chartType={chartType} />
        );
      case "dema":
        return (
          <DEMAIndicators features={features as DEMAFeature[]} chartType={chartType} />
        );
      default:
        return <></>;
    }
  };

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
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPrefix="$"
      />
      {/* x axis marks */}
      <XAxis labels={xLabels} x={x} xPos={0} yPos={height - marginBottom} />
      {/* price trend */}
      {features && getFeaturesPlot()}
      {features && getIndicators()}
      {chartType === "candle" && <CandleStick prices={prices} x={x} y={y} />}
      {chartType === "line" && (
        <TrendLine
          prices={prices}
          x={x}
          y={y}
          showArea={featureGroup !== "bollingerBands"}
        />
      )}
      <StockDataIndicators
        prices={prices}
        chartType={chartType}
        width={width}
        height={height}
        y={y}
      />
    </svg>
  );
}
