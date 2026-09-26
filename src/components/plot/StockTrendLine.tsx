import type { StockPrice } from "@/apis/stock";
import * as d3 from "d3";

type StockTrendLineProps = {
  prices: StockPrice[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function StockTrendLine({ prices, x, y }: StockTrendLineProps) {
  const path = d3
    .line<StockPrice>()
    .defined((price) => x(price.tradeDate) !== undefined)
    .x((price) => (x(price.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y((price) => y(price.adjClose))(prices);
  if (!path) {
    console.error("Failed to create price trend path");
    return <></>;
  }
  return <path d={path} fill="none" stroke="#176B87" strokeWidth={2.0} />;
}
