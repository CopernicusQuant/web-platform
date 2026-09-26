import * as d3 from "d3";
import type { FeatureByGroup } from "@/apis/stock";

type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

type MALinesProps = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  yAxisMin: number;
  yAxisMax: number;
};

const plotFeatures = ["ma5", "ma10", "ma20", "ma60"] as const;
const strokeColors = ["#F38181", "#FCE38A", "#93BFCF", "#95E1D3"];

export default function MALines({ features, x, y, yAxisMin, yAxisMax }: MALinesProps) {
  const paths: Record<string, string> = {};
  plotFeatures.forEach((featureName) => {
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
      {Object.entries(paths).map(([key, value], i) => (
        <path
          key={`priceMomentum-${key}`}
          d={value}
          fill="none"
          stroke={strokeColors[i]}
          strokeWidth={1.5}
          opacity={0.7}
        />
      ))}
    </g>
  );
}
