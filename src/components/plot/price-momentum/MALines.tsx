import * as d3 from "d3";
import type { FeatureByGroup } from "@/apis";
import { maFeatures, pmIDPrefix } from "@plot/interactions/price-momentum";
import { getLineID, getPaths } from "@plot/interactions/d3-utils";
import { colorPalette, svgConfig } from "../theme";

type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

type MALinesProps = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function MALines({ features, x, y }: MALinesProps) {
  const { strokeWidth, opacity } = svgConfig;
  const paths = getPaths<"priceMomentum">(features, maFeatures, x, y);
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
