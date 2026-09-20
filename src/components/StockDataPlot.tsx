import * as d3 from "d3";
import type { StockData } from "@/apis/stock";
import CandleStick from "@/components/plot/CandleSticks";
import XAxis from "@/components/plot/XAxis";
import YAxis from "@/components/plot/YAxis";
import { useRef } from "react";
import { parseDate, getMonthName } from "@/lib/utils";

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
  const plotRef = useRef<SVGSVGElement>(null);
  const indicatorRef = useRef<SVGLineElement>(null);
  const currDateRef = useRef<SVGGElement>(null);

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
  const yPadding = (yMax - yMin) * 0.01 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!indicatorRef.current || !currDateRef.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerPos = event.clientX - rect.x - marginLeft;
    if (pointerPos > 0 && pointerPos < width - marginLeft - marginRight) {
      const xIdx = Math.floor(pointerPos / x.step());
      const tradeDate = stock[xIdx].tradeDate;
      const dateElements = parseDate(tradeDate);
      const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
      const line = d3.select(indicatorRef.current);
      line
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr("opacity", 1)
        .attr("x1", xPos)
        .attr("x2", xPos);
      const currDate = d3.select(currDateRef.current);
      currDate
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr("opacity", "1")
        .attr("transform", `translate(${xPos}, ${height - marginBottom})`);
      currDate.select("#stock-day").text(dateElements[2]);
      currDate.select("#stock-month").text(getMonthName(dateElements[1]));
    } else {
      indicatorRef.current.setAttribute("opacity", "0");
      currDateRef.current.setAttribute("opacity", "0");
    }
  };

  const onPointerLeave = () => {
    const line = d3.select(indicatorRef.current);
    line.interrupt().attr("opacity", "0");
    const currDate = d3.select(currDateRef.current);
    currDate.interrupt().attr("opacity", "0");
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
      {/* candle sticks */}
      <CandleStick prices={stock} x={x} y={y} />
      {/* hover line */}
      <g>
        <line
          ref={indicatorRef}
          y1={marginTop}
          y2={height - marginBottom}
          stroke="gray"
          opacity="0"
          strokeDasharray={"6 4"}
        />
        <g
          ref={currDateRef}
          transform={`translate(0 ${height - marginBottom})`}
          opacity={0}
          fontSize={12}
        >
          <rect x={-18} y={2} width={36} height={36} rx={4} fill="black" opacity={0.9} />
          <text id="stock-day" x={0} y={16} textAnchor="middle" fill="white"></text>
          <text id="stock-month" x={0} y={32} textAnchor="middle" fill="white"></text>
        </g>
      </g>
    </svg>
  );
}
