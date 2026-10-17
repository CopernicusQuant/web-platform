import * as d3 from "d3";
import YAxis from "@/components/ui/YAxis";
import { digitToPercent } from "@/lib/utils";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  toggleVolumeFeature,
  vmIDPrefix,
  volChangesFeatures,
} from "@plot/interactions/volume-momentum";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import type { VolumeMomentumFeature } from "@/apis";
import Legend from "@/components/ui/Legend";

export default function VolChange({
  features,
  width,
  height,
  x,
}: SubplotProps<"volumeMomentum">) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { strokeWidth, markStrokeWidth, markStrokeDasharray } = svgConfig;
  const changesVals = features.reduce((acc, feature) => {
    volChangesFeatures.forEach((featureName) => acc.push(feature[featureName]));
    return acc;
  }, [] as number[]);
  const y = getYScale(changesVals, height - marginBottom, marginTop);
  const paths: Record<string, string> = {};
  volChangesFeatures.forEach((featureName) => {
    const path = d3
      .line<VolumeMomentumFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path) paths[featureName] = path;
  });
  const legendLabels = volChangesFeatures.map(
    (featureName) => `${featureName.match(/\d+/)}D`,
  );
  const lastFeature = features.at(-1);

  return (
    <g>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value: number) => digitToPercent(value, 0)}
      />
      {volChangesFeatures.map((featureName, i) => (
        <g key={getLineID(vmIDPrefix, featureName)}>
          <path
            id={getLineID(vmIDPrefix, featureName)}
            d={paths[featureName]}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
          />
          <Legend
            legendId={getLegendID(vmIDPrefix, featureName)}
            valueId={getLegendValueID(vmIDPrefix, featureName)}
            index={i}
            label={legendLabels[i]}
            value={digitToPercent(lastFeature![featureName])}
            onMouseDown={() => toggleVolumeFeature(featureName)}
          />
        </g>
      ))}
      <line
        x1={x.range()[0]}
        x2={x.range()[1]}
        y1={y(0)}
        y2={y(0)}
        stroke={"black"}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
    </g>
  );
}
