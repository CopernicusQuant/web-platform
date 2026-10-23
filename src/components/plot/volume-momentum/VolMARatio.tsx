import YAxis from "@/components/ui/YAxis";
import { useTranslation } from "react-i18next";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  toggleVolumeFeature,
  vmIDPrefix,
  volMARatioFeatures,
} from "@plot/interactions/volume-momentum";
import type { SubplotProps } from "@/components/shared";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import Legend from "@/components/ui/Legend";

export default function VolMARatio({
  features,
  width,
  height,
  x,
}: SubplotProps<"volumeMomentum">) {
  const { t } = useTranslation();
  const { marginBottom, marginTop, marginLeft, marginRight } = plotSizeConfig;
  const { strokeWidth, markStrokeDasharray, markStrokeWidth } = svgConfig;
  const values = getFeatureValues<"volumeMomentum">(features, volMARatioFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"volumeMomentum">(features, volMARatioFeatures, x, y);
  const lastFeature = features.at(-1);
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      <line
        x1={x.range()[0]}
        x2={x.range()[1]}
        y1={y(1.0)}
        y2={y(1.0)}
        stroke={"black"}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
      {volMARatioFeatures.map((featureName, i) => (
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
            label={t(`featureName.${featureName}`)}
            value={lastFeature![featureName].toFixed(2)}
            onMouseDown={() => toggleVolumeFeature(featureName)}
            size="wider"
          />
        </g>
      ))}
    </>
  );
}
