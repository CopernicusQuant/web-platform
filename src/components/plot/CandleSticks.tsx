import type { StockPrice } from "@/apis/stock";

type CandleStickProps = {
  prices: StockPrice[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function CandleStick({ prices, x, y }: CandleStickProps) {
  return (
    <g>
      {prices.map((price) => {
        const xCoord = x(price.tradeDate) ?? 0;
        const isUp = price.adjClose > price.adjOpen;
        const color = isUp ? "#8EC3B0" : "#FF8787";
        const top = y(Math.max(price.adjClose, price.adjOpen));
        const height = Math.abs(y(price.adjClose) - y(price.adjOpen));
        return (
          <g key={`candle-${price.tradeDate}`}>
            <line
              x1={xCoord + x.bandwidth() / 2}
              x2={xCoord + x.bandwidth() / 2}
              y1={y(price.adjHigh)}
              y2={y(price.adjLow)}
              stroke={color}
            />
            <rect
              x={xCoord}
              y={top}
              width={x.bandwidth()}
              height={height}
              fill={color}
              rx={2}
            />
          </g>
        );
      })}
    </g>
  );
}
