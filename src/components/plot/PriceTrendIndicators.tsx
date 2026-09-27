import type { StockPrice } from "@/apis/stock";
import type { PriceChartType } from "@/atoms/stocks";
import { parseVolume, computePriceChange } from "@/lib/utils";
import { elementIds } from "@/components/plot/interactions/price-trend";

type PriceTrendIndicators = {
  stock: StockPrice[];
  chartType: PriceChartType;
  width: number;
  height: number;
  marginTop: number;
  marginBottom: number;
};

export default function PriceTrendIndicators({
  stock,
  chartType,
  height,
  marginTop,
  marginBottom,
}: PriceTrendIndicators) {
  return (
    <g>
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
    </g>
  );
}
