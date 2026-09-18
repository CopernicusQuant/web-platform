import * as d3 from "d3";
import type { StockData } from "@/apis/stock";
import CandleStick from "@/components/plots/CandleSticks";

type StockDataPlotProps = {
  data: StockData;
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  maxXTickNum?: number;
};

const parseDate = (tradeDate: string): Array<string> => {
  const year = tradeDate.slice(0, 4);
  const month = tradeDate.slice(4, 6);
  const day = tradeDate.slice(-2);
  return [year, month, day];
};

export default function StockDataPlot({
  data,
  width = 1200,
  height = 600,
  marginTop = 20,
  marginRight = 55,
  marginBottom = 40,
  marginLeft = 20,
  maxXTickNum = 30,
}: StockDataPlotProps) {
  const { stock } = data;
  // x-axis mapper
  const x = d3
    .scaleBand(
      stock.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .padding(0.2);
  const xSteps = Math.ceil(stock.length / maxXTickNum);
  const xLabels = stock.filter((_, i) => i % xSteps == 0).map((d) => d.tradeDate);
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.01 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* y axis marks */}
      <g transform={`translate(${marginLeft}, 0)`} fontSize={12}>
        {y.ticks(5).map((tick) => (
          <g key={`stock-${tick}`}>
            <line
              x1={0}
              x2={width - marginLeft - marginRight}
              y1={y(tick)}
              y2={y(tick)}
              stroke="lightgray"
              strokeDasharray={"6 4"}
            />
            <text x={width - marginRight + 12} y={y(tick)} dy={"0.33em"} textAnchor="end">
              ${tick}
            </text>
          </g>
        ))}
      </g>
      {/* x axis marks */}
      <g transform={`translate(0, ${height - marginBottom})`} fontSize={12}>
        {xLabels.map((d, i) => {
          let [showYear, showMonth] = [false, false];
          const [year, month, day] = parseDate(d);
          if (i > 0) {
            const [prevYear, prevMonth] = parseDate(xLabels[i - 1]);
            showMonth = month != prevMonth;
            showYear = year != prevYear;
          }
          return (
            <g key={d}>
              <text
                x={(x(d) ?? 0) + x.bandwidth() / 2}
                y={18}
                textAnchor="middle"
                color="black"
              >
                {day}
              </text>
              {(showMonth || showYear) && (
                <text
                  x={(x(d) ?? 0) + x.bandwidth() / 2}
                  y={32}
                  textAnchor="middle"
                  color="black"
                >
                  {/* will switch between year and month */}
                  {showYear ? year : month}
                </text>
              )}
            </g>
          );
        })}
      </g>
      {/* candle sticks */}
      <CandleStick prices={stock} x={x} y={y} />
    </svg>
  );
}
