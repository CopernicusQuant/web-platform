import YAxis from "@/components/ui/YAxis";
import {
  maBiasFeatures,
  pmIDPrefix,
  toggleFeature,
} from "@plot/interactions/price-momentum";
import {
  getFeatureValues,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import FeatureIndicators from "@plot/price-momentum/FeatureIndicators";
import { digitToPercent } from "@/lib/utils";
import type { SubplotProps } from "@/components/shared";

export default function MABias({
  features,
  width,
  height,
  x,
}: SubplotProps<"pricemomentum">) {
  const { markStrokeDasharray, markStrokeWidth, strokeWidth } = svgConfig;
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;

  const values = getFeatureValues<"pricemomentum">(features, maBiasFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"pricemomentum">(features, maBiasFeatures, x, y);
  const legendLabels: string[] = [];
  maBiasFeatures.forEach((featureName) => {
    const daysLabel = featureName.match(/\d+/);
    if (!daysLabel) legendLabels.push(featureName);
    else legendLabels.push(`${daysLabel}D`);
  });

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPostfix="%"
        labelFormatter={(value: number) => (value * 100).toFixed(1)}
      />
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={`${getLineID(pmIDPrefix, featureName)}`}
          id={`${getLineID(pmIDPrefix, featureName)}`}
          d={value}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={colorPalette[i]}
        />
      ))}
      {/* 0% indicator */}
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(0.0)}
        y2={y(0.0)}
        stroke="black"
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
      <FeatureIndicators
        featureNames={maBiasFeatures}
        features={features}
        valueFormatFn={digitToPercent}
        labels={legendLabels}
        toggleFn={toggleFeature}
      />
    </>
  );
}
