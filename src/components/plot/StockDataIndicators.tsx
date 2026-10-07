import * as d3 from "d3";
import type { StockPrice } from "@/apis/stock";
import { plotSizeConfig, priceColors, legendConfig } from "@/components/plot/theme";
import type { PriceChartType } from "@/atoms/stocks";
import { parseVolume, computePriceChange } from "@/lib/utils";
import { priceElementIds } from "@/components/plot/interactions/price-trend";
import DateLine from "./DateLine";

type StockDataIndicatorsProps = {
  stock: StockPrice[];
  chartType: PriceChartType;
  width: number;
  height: number;
  y: d3.ScaleLinear<number, number>;
};

const visConfig = {
  width: 68,
  pctWidth: 116,
};

export default function StockDataIndicators({
  stock,
  chartType,
  width,
  height,
  y,
}: StockDataIndicatorsProps) {
  const { marginRight } = plotSizeConfig;
  const isUp = (stock.at(0)?.adjClose ?? 0) <= (stock.at(-1)?.adjClose ?? 0);
  return (
    <g>
      <g id={priceElementIds.indicatorGroup} opacity={0}>
        <DateLine
          height={height}
          dateGroupId={priceElementIds.indicatorDateGroup}
          dayId={priceElementIds.indicatorDay}
          monthId={priceElementIds.indicatorMonth}
        />

        {chartType === "line" && (
          <circle
            id={priceElementIds.indicatorPoint}
            cx={0}
            cy={0}
            r={5}
            stroke="white"
            strokeWidth={2}
            fill={isUp ? priceColors.up : priceColors.down}
            opacity={chartType === "line" ? 1 : 0}
          />
        )}
      </g>
      {/* values */}
      {stock.at(-1) && (
        <g>
          <rect
            id={priceElementIds.valuesPctRect}
            x={width - visConfig.pctWidth}
            y={legendConfig.top}
            width={visConfig.pctWidth}
            height={22}
            rx={legendConfig.rectCorner}
            fill={isUp ? priceColors.up : priceColors.down}
          />
          <text
            x={width - visConfig.pctWidth / 2}
            y={20}
            textAnchor="middle"
            fontSize={13.5}
            fill="white"
            fontWeight={600}
          >
            <tspan>Pct.</tspan>
            <tspan dx={6} id={priceElementIds.valuesPctChange}>
              {computePriceChange(stock.at(0)?.adjClose, stock.at(-1)?.adjClose)}
            </tspan>
          </text>
          <g
            transform={`translate(${width - marginRight - visConfig.pctWidth - visConfig.width / 2} 0)`}
          >
            <text
              y={legendConfig.top + legendConfig.lineHeight}
              textAnchor="start"
              fontSize={legendConfig.fontSize}
              fill="gray"
            >
              <tspan>O</tspan>
              <tspan dx={4} id={priceElementIds.valuesOpen} fill="black">
                {stock.at(-1)!.adjOpen.toFixed(2)}
              </tspan>
              <tspan x={-visConfig.width}>C</tspan>
              <tspan dx={4} id={priceElementIds.valuesClose} fill="black">
                {stock.at(-1)!.adjClose.toFixed(2)}
              </tspan>
              <tspan x={-visConfig.width * 2}>H</tspan>
              <tspan dx={4} id={priceElementIds.valuesHigh} fill="black">
                {stock.at(-1)!.adjHigh.toFixed(2)}
              </tspan>
              <tspan x={-visConfig.width * 3}>L</tspan>
              <tspan dx={4} id={priceElementIds.valuesLow} fill="black">
                {stock.at(-1)!.adjLow.toFixed(2)}
              </tspan>
              <tspan x={-visConfig.width * 4}>V</tspan>
              <tspan dx={4} id={priceElementIds.valuesVol} fill="black">
                {parseVolume(stock.at(-1)!.adjVol)}
              </tspan>
            </text>
          </g>
        </g>
      )}
      <g
        id={priceElementIds.valuesCurrGroup}
        transform={`translate(${width - marginRight}, ${y(stock.at(-1)?.adjClose || 0)})`}
      >
        <rect
          id={priceElementIds.valuesCurrRect}
          x={4}
          y={-10}
          width={48}
          height={20}
          rx={legendConfig.rectCorner}
          fill={isUp ? priceColors.up : priceColors.down}
        />
        <text
          id={priceElementIds.valuesCurrVal}
          x={28}
          y={0}
          dy={"0.33em"}
          textAnchor="middle"
          fill="white"
          fontSize={12}
        >
          {stock.at(-1)?.adjClose}
        </text>
      </g>
    </g>
  );
}
