import * as d3 from "d3";
import type { StockValues } from "@/apis";
import { colorPalette } from "@plot/theme";
import Legend from "@/components/ui/Legend";
import {
  getBarGroupID,
  getLegendID,
  getLegendValueID,
} from "@plot/interactions/d3-utils";
import { marketIDPrefix, toggleFeature } from "@plot/interactions/market-activity";

type TurnoverBarsProps = {
  stock: StockValues[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function TurnoverBars({ stock, x, y }: TurnoverBarsProps) {
  const yMax = d3.max(stock, (d) => d.turnover) ?? 1;
  const yMin = d3.min(stock, (d) => d.turnover) ?? 0;
  const yRange = y.range();
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const subY = d3.scaleLinear(
    [yMin === 0 ? 0 : yMin - yPadding, yMax + yPadding],
    [yRange[0], yRange[0] + (yRange[1] - yRange[0]) / 2],
  );
  return (
    <>
      <g id={getBarGroupID(marketIDPrefix, "turnover")}>
        {stock.map((values) => (
          <rect
            key={`market-turnover-${values.tradeDate}`}
            x={x(values.tradeDate)}
            y={subY(values.turnover)}
            width={x.bandwidth()}
            height={subY.range()[0] - subY(values.turnover)}
            fill={colorPalette[2]}
            opacity={0.6}
          />
        ))}
      </g>
      <Legend
        legendId={getLegendID(marketIDPrefix, "turnover")}
        valueId={getLegendValueID(marketIDPrefix, "turnover")}
        label="Turnover"
        index={0}
        value={stock.at(-1)?.turnover.toFixed(2) || "0.0"}
        color={colorPalette[2]}
        onMouseDown={() => toggleFeature("turnover")}
      />
    </>
  );
}
