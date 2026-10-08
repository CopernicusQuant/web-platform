import * as d3 from "d3";
import type { StockValues } from "@/apis/stock";
import {
  getMarketBarGroupID,
  getMarketLegendID,
  getMarketLegendValueID,
} from "@/components/plot/interactions/market-activity";
import { colorPalette } from "@/components/plot/theme";
import Legend from "@/components/ui/Legend";

type TurnoverBarsProps = {
  stock: StockValues[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function TurnoverBars({ stock, x, y }: TurnoverBarsProps) {
  const yMax = d3.max(stock, (d) => d.turnover) ?? 1;
  const yMin = d3.min(stock, (d) => d.turnover) ?? 0;
  const [yLow] = y.range();
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const subY = d3.scaleLinear(
    [yMin === 0 ? 0 : yMin - yPadding, yMax + yPadding],
    [0, yLow / 2],
  );
  return (
    <>
      <g id={getMarketBarGroupID("turnover")}>
        {stock.map((price) => (
          <rect
            key={`market-turnover-${price.tradeDate}`}
            transform={`translate(0 -${subY(price.turnover)})`}
            x={x(price.tradeDate)}
            y={y(y.domain()[0])}
            width={x.bandwidth()}
            height={subY(price.turnover)}
            fill={colorPalette[2]}
            opacity={0.6}
          />
        ))}
      </g>
      <Legend
        legendId={getMarketLegendID("turnover")}
        valueId={getMarketLegendValueID("turnover")}
        label="Turnover"
        index={0}
        value={stock.at(-1)?.turnover.toFixed(2) || "0.0"}
        color={colorPalette[2]}
      />
    </>
  );
}
