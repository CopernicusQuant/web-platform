import * as d3 from "d3";
import { useRef } from "react";
import type { PriceChartType } from "@/atoms/stocks";
import type { FeatureByGroup, FeatureGroupOpt, StockData } from "@/apis/stock";
import CandleStick from "@/components/plot/CandleSticks";
import XAxis from "@/components/plot/XAxis";
import YAxis from "@/components/plot/YAxis";
import TrendLine from "@/components/plot/StockTrendLine";
import MALines from "@/components/plot/price-momentum/MALines";
import {
  resetPriceTrendIndicators,
  updatePriceTrendIndicators,
} from "@/components/plot/interactions/price-trend";
import PriceTrendIndicators from "./PriceTrendIndicators";
import {
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
} from "./interactions/price-momentum";
import MAIndicators from "./price-momentum/MAIndicators";

type StockDataPlotProps = {
  data: StockData<FeatureGroupOpt>;
  chartType: PriceChartType;
  featureGroup: FeatureGroupOpt;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  maxXTickNum?: number;
};

export default function StockDataPlot({
  data,
  chartType,
  featureGroup,
  width = 1100,
  height = 600,
  marginTop = 40,
  marginRight = 40,
  marginBottom = 40,
  marginLeft = 0,
  maxXTickNum = 30,
}: StockDataPlotProps) {
  const { stock, features } = data;
  const plotRef = useRef<SVGSVGElement>(null);

  // x-axis mapper
  const x = d3
    .scaleBand(
      stock.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  const xSteps = Math.floor(stock.length / maxXTickNum);
  const xLabels = stock.filter((_, i) => i % xSteps == 0).map((d) => d.tradeDate);
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  // controls hover-based indicators
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerPos = event.clientX - rect.x - marginLeft;
    let xIdx = Math.floor(pointerPos / x.step());
    xIdx = Math.max(Math.min(xIdx, stock.length - 1), 0);
    updatePriceTrendIndicators({
      stock,
      pointerPos,
      xIdx,
      height,
      marginBottom,
      x,
      y,
    });
    switch (featureGroup) {
      case "priceMomentum":
        updatePriceMomentumIndicators({
          xIdx,
          features: features as FeatureByGroup["priceMomentum"][],
          x,
          y,
        });
    }
  };

  const onPointerLeave = () => {
    resetPriceTrendIndicators({ stock });
    switch (featureGroup) {
      case "priceMomentum":
        resetPriceMomentumIndicators();
    }
  };

  return (
    <svg
      ref={plotRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="overflow-visible"
    >
      {/* y axis marks */}
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXPos={width - marginRight / 2}
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
      {chartType === "candle" && <CandleStick prices={stock} x={x} y={y} />}
      {chartType === "line" && <TrendLine prices={stock} x={x} y={y} />}
      <PriceTrendIndicators
        stock={stock}
        chartType={chartType}
        width={width}
        height={height}
        marginTop={marginTop}
        marginBottom={marginBottom}
      />
      {featureGroup === "priceMomentum" && <MAIndicators chartType={chartType} />}
    </svg>
  );
}
