import * as d3 from "d3";
import YAxis from "@/components/ui/YAxis";
import { useTranslation } from "react-i18next";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  toggleVolumeFeature,
  vmIDPrefix,
  volMARatioFeatures,
} from "@plot/interactions/volume-momentum";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import type { VolumeMomentumFeature } from "@/apis";
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
  const maRatioValues = features.reduce((curr, feature) => {
    volMARatioFeatures.forEach((featureName) => curr.push(feature[featureName]));
    return curr;
  }, [] as number[]);
  const y = getYScale(maRatioValues, height - marginBottom, marginTop);
  const paths: Record<string, string> = {};
  volMARatioFeatures.forEach((featureName) => {
    const path = d3
      .line<VolumeMomentumFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
  });
  const lastFeature = features.at(-1);
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
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
      <line
        x1={x.range()[0]}
        x2={x.range()[1]}
        y1={y(1.0)}
        y2={y(1.0)}
        stroke={"black"}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
    </>
  );
}
