import * as d3 from "d3";
import type { FeatureByGroup } from "@/apis/stock";
import {
  getMALineId,
  maFeatures,
  maColors,
} from "@/components/plot/interactions/price-momentum";

type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

type MALinesProps = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  yAxisMin: number;
  yAxisMax: number;
};

export default function MALines({ features, x, y, yAxisMin, yAxisMax }: MALinesProps) {
  const paths: Record<string, string> = {};
  maFeatures.forEach((featureName) => {
    const path = d3
      .line<PriceMomentumFeature>()
      .defined(
        (feature) =>
          y(feature[featureName]) <= yAxisMax && y(feature[featureName]) >= yAxisMin,
      )
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) {
      paths[featureName] = path;
    }
  });
  return (
    <g>
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={getMALineId(featureName)}
          id={getMALineId(featureName)}
          d={value}
          fill="none"
          stroke={maColors[i]}
          strokeWidth={2.0}
          opacity={0.7}
        />
      ))}
    </g>
  );
}
