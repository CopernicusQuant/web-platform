import YAxis from "@/components/ui/YAxis";
import { digitToPercent } from "@/lib/utils";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@stocks/plot/interactions/d3-utils";
import {
  toggleVolumeFeature,
  vmIDPrefix,
  volChangesFeatures,
} from "@stocks/plot/interactions/volume-momentum";
import type { SubplotProps } from "@/components/stocks/shared";
import { colorPalette, plotSizeConfig, svgConfig } from "@/lib/theme";
import Legend from "@/components/ui/Legend";

export default function VolChange({
  features,
  width,
  height,
  x,
}: SubplotProps<"volumemomentum">) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { strokeWidth, markStrokeWidth, markStrokeDasharray } = svgConfig;
  const values = getFeatureValues<"volumemomentum">(features, volChangesFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"volumemomentum">(features, volChangesFeatures, x, y);
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
