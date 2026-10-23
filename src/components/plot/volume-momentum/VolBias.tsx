import {
  toggleVolumeFeature,
  vmIDPrefix,
  volBiasFeatures,
} from "@plot/interactions/volume-momentum";
import type { SubplotProps } from "@/components/shared";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import Legend from "@/components/ui/Legend";
import { digitToPercent } from "@/lib/utils";

export default function VolBias({
  features,
  width,
  height,
  x,
}: SubplotProps<"volumeMomentum">) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { strokeWidth, markStrokeDasharray, markStrokeWidth } = svgConfig;
  const values = getFeatureValues<"volumeMomentum">(features, volBiasFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"volumeMomentum">(features, volBiasFeatures, x, y);
  const legendLabels = volBiasFeatures.map(
    (featureName) => `${featureName.match(/\d+/)}D`,
  );
  const lastFeature = features.at(-1);

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(val: number) => digitToPercent(val, 0)}
      />
      {volBiasFeatures.map((featureName, i) => (
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
    </>
  );
}
