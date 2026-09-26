import * as d3 from "d3";
import { useRef } from "react";
import type { PriceChartType } from "@/atoms/stocks";
import { parseDate, getMonthName, parseVolume, computePriceChange } from "@/lib/utils";
import type { FeatureByGroup, FeatureGroupOpt, StockData } from "@/apis/stock";
import CandleStick from "@/components/plot/CandleSticks";
import XAxis from "@/components/plot/XAxis";
import YAxis from "@/components/plot/YAxis";
import TrendLine from "@/components/plot/StockTrendLine";
import MALines from "./price-momentum/MALines";

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

const elementIds = {
  indicatorGroup: "price-indicator-group",
  indicatorLine: "price-indicator-line",
  indicatorPoint: "price-indicator-point",
  indicatorDateGroup: "price-indicator-date",
  indicatorDay: "price-indicator-day",
  indicatorMonth: "price-indicator-month",
  valuesOpen: "price-values-open",
  valuesClose: "price-values-close",
  valuesHigh: "price-values-high",
  valuesLow: "price-values-low",
  valuesVol: "price-values-vol",
  valuesPctChange: "price-pct-change",
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
    const indicatorGroup = d3.select(`#${elementIds.indicatorGroup}`);
    indicatorGroup.attr("opacity", 1);
    if (pointerPos > 0 && pointerPos < width - marginLeft - marginRight) {
      const xIdx = Math.floor(pointerPos / x.step());
      const { tradeDate, adjClose, adjOpen, adjHigh, adjLow, adjVol } = stock[xIdx];
      const dateElements = parseDate(tradeDate);
      const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
      const yPos = y(adjClose) ?? 0;
      const line = indicatorGroup.select(`#${elementIds.indicatorLine}`);
      const currDate = indicatorGroup.select(`#${elementIds.indicatorDateGroup}`);
      const circle = indicatorGroup.select(`#${elementIds.indicatorPoint}`);
      line
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr("x1", xPos)
        .attr("x2", xPos);
      circle
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr("cx", xPos)
        .attr("cy", yPos);
      currDate
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr("transform", `translate(${xPos}, ${height - marginBottom})`);
      currDate.select(`#${elementIds.indicatorDay}`).text(dateElements[2]);
      currDate
        .select(`#${elementIds.indicatorMonth}`)
        .text(getMonthName(dateElements[1]));
      d3.select(`#${elementIds.valuesClose}`).text(`${adjClose.toFixed(2)}`);
      d3.select(`#${elementIds.valuesOpen}`).text(`${adjOpen.toFixed(2)}`);
      d3.select(`#${elementIds.valuesHigh}`).text(`${adjHigh.toFixed(2)}`);
      d3.select(`#${elementIds.valuesLow}`).text(`${adjLow.toFixed(2)}`);
      d3.select(`#${elementIds.valuesPctChange}`).text(
        `${computePriceChange(stock.at(0)?.adjClose, adjClose)}`,
      );
      d3.select(`#${elementIds.valuesVol}`).text(`${parseVolume(adjVol)}`);
    } else {
      indicatorGroup.attr("opacity", 0);
    }
  };

  const onPointerLeave = () => {
    const indicatorGroup = d3.select("#price-indicator-group");
    indicatorGroup.attr("opacity", 0);
    const lastestStock = stock.at(-1);
    if (!lastestStock) return;
    const { adjClose, adjOpen, adjHigh, adjLow, adjVol } = stock.at(-1)!;
    d3.select(`#${elementIds.valuesClose}`).text(`${adjClose.toFixed(2)}`);
    d3.select(`#${elementIds.valuesOpen}`).text(`${adjOpen.toFixed(2)}`);
    d3.select(`#${elementIds.valuesHigh}`).text(`${adjHigh.toFixed(2)}`);
    d3.select(`#${elementIds.valuesLow}`).text(`${adjLow.toFixed(2)}`);
    d3.select(`#${elementIds.valuesPctChange}`).text(
      `${computePriceChange(stock.at(0)?.adjClose, stock.at(-1)?.adjClose)}`,
    );
    d3.select(`#${elementIds.valuesVol}`).text(`${parseVolume(adjVol)}`);
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
      {/* hover line */}
      <g id={elementIds.indicatorGroup} opacity={0}>
        <line
          id={elementIds.indicatorLine}
          y1={marginTop}
          y2={height - marginBottom}
          stroke="gray"
          strokeDasharray={"6 4"}
        />
        <g
          id={elementIds.indicatorDateGroup}
          transform={`translate(0 ${height - marginBottom})`}
          fontSize={12}
        >
          <rect x={-18} y={2} width={36} height={36} rx={4} fill="black" opacity={0.9} />
          <text
            id={elementIds.indicatorDay}
            x={0}
            y={16}
            textAnchor="middle"
            fill="white"
          ></text>
          <text
            id={elementIds.indicatorMonth}
            x={0}
            y={32}
            textAnchor="middle"
            fill="white"
          ></text>
        </g>
        <circle
          id={elementIds.indicatorPoint}
          cx={0}
          cy={0}
          r={5}
          stroke="white"
          strokeWidth={2}
          fill={"#3368A0"}
          opacity={chartType === "line" ? 1 : 0}
        />
      </g>
      {/* values */}
      {stock.at(-1) && (
        <g>
          <text x={0} y={16} textAnchor="start" fontSize={13} fill="gray">
            <tspan x={0}>Open</tspan>
            <tspan x={92}>Close</tspan>
            <tspan x={92 * 2 + 3}>High</tspan>
            <tspan x={92 * 3 + 3}>Low</tspan>
            <tspan x={92 * 3 + 3}>Low</tspan>
            <tspan x={92 * 4 + 3}>Pct.</tspan>
            <tspan x={0} dy={22}>
              Volume
            </tspan>
          </text>
          <text x={0} y={16} textAnchor="start" fontSize={14}>
            <tspan x={36} id={elementIds.valuesOpen}>
              {stock.at(-1)!.adjOpen.toFixed(2)}
            </tspan>
            <tspan x={92 + 36 + 3} id={elementIds.valuesClose}>
              {stock.at(-1)!.adjClose.toFixed(2)}
            </tspan>
            <tspan x={92 * 2 + 36} id={elementIds.valuesHigh}>
              {stock.at(-1)!.adjHigh.toFixed(2)}
            </tspan>
            <tspan x={92 * 3 + 36 - 3} id={elementIds.valuesLow}>
              {stock.at(-1)!.adjLow.toFixed(2)}
            </tspan>
            <tspan x={92 * 4 + 32} dy={0} id={elementIds.valuesPctChange}>
              {computePriceChange(stock.at(0)?.adjClose, stock.at(-1)?.adjClose)}
            </tspan>
            <tspan x={50} dy={22} id={elementIds.valuesVol}>
              {parseVolume(stock.at(-1)!.adjVol)}
            </tspan>
          </text>
        </g>
      )}
    </svg>
  );
}
