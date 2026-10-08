import type { StockValues } from "@/apis/stock";
import * as d3 from "d3";
import { priceColors } from "./theme";

type StockTrendLineProps = {
  prices: StockValues[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function StockTrendLine({ prices, x, y }: StockTrendLineProps) {
  const path = d3
    .line<StockValues>()
    .x((price) => (x(price.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y((price) => y(price.adjClose))(prices);

  const strokeColor =
    prices.at(-1)!.adjClose >= prices.at(0)!.adjClose ? priceColors.up : priceColors.down;

  const [chartBottom, chartTop] = y.range();

  const area = d3
    .area<StockValues>()
    .x((price) => (x(price.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y0(chartBottom)
    .y1((price) => y(price.adjClose))(prices);

  if (!path || path.length === 0 || !area) {
    console.error("Failed to create price trend path");
    return <></>;
  }

  const linearGradientID = "stock-trend-gradient";

  return (
    <>
      <defs>
        <linearGradient
          id={linearGradientID}
          x1="0"
          x2="0"
          y1={chartTop}
          y2={chartBottom}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
          <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${linearGradientID})`} />;
      <path d={path} fill="none" stroke={strokeColor} strokeWidth={2.0} />;
    </>
  );
}
