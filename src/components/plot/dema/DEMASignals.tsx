import type { DEMAFeature } from "@/apis";
import { demaPeriodAtom } from "@/atoms/plot";
import { getCrossLinesID } from "@plot/interactions/d3-utils";
import { demaIDPrefix, getDEMAFeatureNamesByPeriod } from "@plot/interactions/dema";
import { priceColors, svgConfig } from "@plot/theme";
import { useAtomValue } from "jotai";

type DEMASignalsProps = {
  features: DEMAFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  currPlot?: "price" | "feature";
};
export default function DEMASignals({
  features,
  x,
  y,
  currPlot = "price",
}: DEMASignalsProps) {
  const demaPeriod = useAtomValue(demaPeriodAtom);
  const featureNames = getDEMAFeatureNamesByPeriod(demaPeriod);
  const goldDays: string[] = [];
  const deadDays: string[] = [];
  features.filter((feature) => {
    const goldCrossName = featureNames.filter((name) => name.endsWith("gold"))[0];
    const deadCrossName = featureNames.filter((name) => name.endsWith("dead"))[0];
    if (feature[goldCrossName] === 1) goldDays.push(feature.tradeDate);
    if (feature[deadCrossName] === 1) deadDays.push(feature.tradeDate);
  });

  const drawLine = (date: string, stroke: string) => {
    return (
      <line
        key={`dema-gold-${date}`}
        x1={(x(date) ?? 0) + x.bandwidth() / 2}
        x2={(x(date) ?? 0) + x.bandwidth() / 2}
        y1={y.range()[0]}
        y2={y.range()[1]}
        strokeWidth={svgConfig.strokeWidth}
        stroke={stroke}
        strokeDasharray={svgConfig.strokeDasharray}
      />
    );
  };

  return (
    <g opacity={0.4}>
      <g id={getCrossLinesID(demaIDPrefix, `gold-${currPlot}`)}>
        {goldDays.map((date) => drawLine(date, priceColors.up))}
      </g>
      <g id={getCrossLinesID(demaIDPrefix, `dead-${currPlot}`)}>
        {deadDays.map((date) => drawLine(date, priceColors.down))}
      </g>
    </g>
  );
}
