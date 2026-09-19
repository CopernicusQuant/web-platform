import * as d3 from "d3";
import type { StockData } from "@/apis/stock";
import CandleStick from "@/components/plot/CandleSticks";
import XAxis from "./plot/XAxis";
import YAxis from "./plot/YAxis";

type StockDataPlotProps = {
  data: StockData;
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
  width = 1100,
  height = 600,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 40,
  marginLeft = 0,
  maxXTickNum = 30,
}: StockDataPlotProps) {
  const { stock } = data;
  // x-axis mapper
  const x = d3
    .scaleBand(
      stock.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .padding(0.2);
  const xSteps = Math.ceil(stock.length / maxXTickNum);
  const xLabels = stock.filter((_, i) => i % xSteps == 0).map((d) => d.tradeDate);
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.01 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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
      {/* candle sticks */}
      <CandleStick prices={stock} x={x} y={y} />
    </svg>
  );
}
