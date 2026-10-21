import * as d3 from "d3";
import type { MACDFeature } from "@/apis";
import { emaFeatures, macdIDPrefix } from "@plot/interactions/macd";
import { colorPalette, svgConfig } from "@plot/theme";
import { getLineID, getPaths } from "@plot/interactions/d3-utils";

type EMALinesProps = {
  features: MACDFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function EMALines({ features, x, y }: EMALinesProps) {
  const { strokeWidth, opacity } = svgConfig;
  const paths = getPaths<"macd">(features, emaFeatures, x, y);
  return (
    <g>
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={getLineID(macdIDPrefix, featureName)}
          id={getLineID(macdIDPrefix, featureName)}
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
