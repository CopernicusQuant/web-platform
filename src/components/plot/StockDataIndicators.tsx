import * as d3 from "d3";
import type { StockPrice } from "@/apis/stock";
import { priceColors, priceTrendConfig } from "@/components/plot/theme";
import type { PriceChartType } from "@/atoms/stocks";
import { parseVolume, computePriceChange } from "@/lib/utils";
import { elementIds } from "@/components/plot/interactions/price-trend";

type StockDataIndicatorsProps = {
  stock: StockPrice[];
  chartType: PriceChartType;
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  marginRight: number;
  y: d3.ScaleLinear<number, number>;
};

const visConfig = {
  left: 130,
  width: 68,
};

export default function StockDataIndicators({
  stock,
  chartType,
  width,
  height,
  marginTop,
  marginBottom,
  marginRight,
  y,
}: StockDataIndicatorsProps) {
  const isUp = (stock.at(0)?.adjClose ?? 0) <= (stock.at(-1)?.adjClose ?? 0);
  return (
    <g>
      <g id={elementIds.indicatorGroup} opacity={0}>
        {/* Vertical dashed line */}
        <line
          id={elementIds.indicatorLine}
          y1={marginTop}
          y2={height - marginBottom}
          stroke="gray"
          strokeDasharray={"6 4"}
        />
        {/* Date indicators */}
        <g
          id={elementIds.indicatorDateGroup}
          transform={`translate(0 ${height - marginBottom})`}
          fontSize={12}
        >
          <rect
            x={-18}
            y={2}
            width={36}
            height={36}
            rx={priceTrendConfig.rectCorner}
            fill="black"
            opacity={0.9}
          />
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
        {chartType === "line" && (
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
        )}
      </g>
      {/* values */}
      {stock.at(-1) && (
        <g>
          <rect
            id={elementIds.valuesPctRect}
            x={0}
            y={priceTrendConfig.top}
            width={116}
            height={22}
            rx={priceTrendConfig.rectCorner}
            fill={isUp ? priceColors.up : priceColors.down}
          />
          <text
            x={58}
            y={20}
            textAnchor="middle"
            fontSize={13.5}
            fill="white"
            fontWeight={600}
          >
            <tspan>Pct.</tspan>
            <tspan dx={6} id={elementIds.valuesPctChange}>
              {computePriceChange(stock.at(0)?.adjClose, stock.at(-1)?.adjClose)}
            </tspan>
          </text>
          <text
            y={priceTrendConfig.top + priceTrendConfig.lineHeight}
            textAnchor="start"
            fontSize={priceTrendConfig.valueFontSize}
            fill="gray"
          >
            <tspan x={visConfig.left}>O</tspan>
            <tspan dx={4} id={elementIds.valuesOpen} fill="black">
              {stock.at(-1)!.adjOpen.toFixed(2)}
            </tspan>
            <tspan x={visConfig.left + visConfig.width}>C</tspan>
            <tspan dx={4} id={elementIds.valuesClose} fill="black">
              {stock.at(-1)!.adjClose.toFixed(2)}
            </tspan>
            <tspan x={visConfig.left + visConfig.width * 2}>H</tspan>
            <tspan dx={4} id={elementIds.valuesHigh} fill="black">
              {stock.at(-1)!.adjHigh.toFixed(2)}
            </tspan>
            <tspan x={visConfig.left + visConfig.width * 3}>L</tspan>
            <tspan dx={4} id={elementIds.valuesLow} fill="black">
              {stock.at(-1)!.adjLow.toFixed(2)}
            </tspan>
            <tspan x={visConfig.left + visConfig.width * 4}>V</tspan>
            <tspan dx={4} id={elementIds.valuesVol} fill="black">
              {parseVolume(stock.at(-1)!.adjVol)}
            </tspan>
          </text>
        </g>
      )}
      <g
        id={elementIds.valuesCurrGroup}
        transform={`translate(${width - marginRight}, ${y(stock.at(-1)?.adjClose || 0)})`}
      >
        <rect
          id={elementIds.valuesCurrRect}
          x={4}
          y={-10}
          width={48}
          height={20}
          rx={priceTrendConfig.rectCorner}
          fill={isUp ? priceColors.up : priceColors.down}
        />
        <text
          id={elementIds.valuesCurrVal}
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
