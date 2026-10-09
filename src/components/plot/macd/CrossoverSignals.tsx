import * as d3 from "d3";

import type { MACDFeature } from "@/apis";
import { priceColors } from "../theme";
import { getMACDCrossLinesID } from "../interactions/macd";

type CrossoverSignalsProps = {
  features: MACDFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function CrossoverSignals({ features, x, y }: CrossoverSignalsProps) {
  const goldDays: string[] = [];
  const deadDays: string[] = [];
  features.forEach((feature) => {
    if (feature.gold === 1) goldDays.push(feature.tradeDate);
    if (feature.dead === 1) deadDays.push(feature.tradeDate);
  });

  const drawLine = (date: string, stroke: string) => {
    return (
      <line
        key={`macd-gold-${date}`}
        x1={(x(date) ?? 0) + x.bandwidth() / 2}
        x2={(x(date) ?? 0) + x.bandwidth() / 2}
        y1={y.range()[0]}
        y2={y.range()[1]}
        strokeWidth={1.5}
        stroke={stroke}
        strokeDasharray={"10 4"}
      />
    );
  };

  return (
    <g opacity={0.4}>
      <g id={getMACDCrossLinesID("gold")}>
        {goldDays.map((date) => drawLine(date, priceColors.up))}
      </g>
      <g id={getMACDCrossLinesID("dead")}>
        {deadDays.map((date) => drawLine(date, priceColors.down))}
      </g>
    </g>
  );
}
