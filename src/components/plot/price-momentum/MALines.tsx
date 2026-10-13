import * as d3 from "d3";
import type { FeatureByGroup } from "@/apis";
import { maFeatures, pmIDPrefix } from "@plot/interactions/price-momentum";
import { getLineID } from "@plot/interactions/d3-utils";
import { colorPalette, svgPathConfig } from "../theme";

type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

type MALinesProps = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  yAxisMin: number;
  yAxisMax: number;
};

export default function MALines({ features, x, y, yAxisMin, yAxisMax }: MALinesProps) {
  const { strokeWidth, opacity } = svgPathConfig;
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
          key={getLineID(pmIDPrefix, featureName)}
          id={getLineID(pmIDPrefix, featureName)}
          d={value}
          fill="none"
          stroke={colorPalette[i]}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      ))}
    </g>
  );
}
