import * as d3 from "d3";
import type { MACDFeature } from "@/apis";
import { emaFeatures, getMACDLineID } from "../interactions/macd";
import { colorPalette } from "../theme";

type EMALinesProps = {
  features: MACDFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function EMALines({ features, x, y }: EMALinesProps) {
  const paths: Record<string, string> = {};
  const yDomain = y.domain();
  emaFeatures.forEach((featureName) => {
    const path = d3
      .line<MACDFeature>()
      .defined(
        (feature) =>
          feature[featureName] >= Math.min(...yDomain) &&
          feature[featureName] <= Math.max(...yDomain),
      )
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
  });
  return (
    <g>
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={getMACDLineID(featureName)}
          id={getMACDLineID(featureName)}
          d={value}
          fill="none"
          stroke={colorPalette[i]}
          strokeWidth={1.5}
          opacity={0.7}
        />
      ))}
    </g>
  );
}
