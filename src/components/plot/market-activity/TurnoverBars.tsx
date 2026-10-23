import * as d3 from "d3";
import type { StockPrice } from "@/apis";
import { colorPalette } from "@plot/theme";
import Legend from "@/components/ui/Legend";
import {
  getBarGroupID,
  getLegendID,
  getLegendValueID,
  getYScale,
} from "@plot/interactions/d3-utils";
import { marketIDPrefix, toggleFeature } from "@plot/interactions/market-activity";

type TurnoverBarsProps = {
  prices: StockPrice[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function TurnoverBars({ prices, x, y }: TurnoverBarsProps) {
  const values = prices.map((price) => price.turnover);
  const yRange = y.range();
  const [yEnd, yStart] = [yRange[0], yRange[0] + (yRange[1] - yRange[0]) / 2];
  const subY = getYScale(values, yEnd, yStart);
  return (
    <>
      <g id={getBarGroupID(marketIDPrefix, "turnover")}>
        {prices.map((values) => (
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
        value={prices.at(-1)?.turnover.toFixed(2) || "0.0"}
        color={colorPalette[2]}
        onMouseDown={() => toggleFeature("turnover")}
      />
    </>
  );
}
