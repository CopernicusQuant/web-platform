import {
  toggleFeature,
  upDayRatioFeatures,
  pmIDPrefix,
} from "@stocks/plot/interactions/price-momentum";
import YAxis from "@/components/ui/YAxis";
import { colorPalette, plotSizeConfig } from "@/lib/theme";
import FeatureIndicators from "./FeatureIndicators";
import { digitToPercent } from "@/lib/utils";
import type { SubplotProps } from "@/components/stocks/shared";
import { getLineID, getPaths, getYScale } from "@stocks/plot/interactions/d3-utils";

export default function UpDayRatio({
  features,
  width,
  height,
  x,
}: SubplotProps<"pricemomentum">) {
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;
  const y = getYScale([0.0, 1.0], height - marginBottom, marginTop);
  const paths = getPaths<"pricemomentum">(features, upDayRatioFeatures, x, y);
  const legendLabels: string[] = [];
  upDayRatioFeatures.forEach((featureName) => {
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
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(0.5)}
        y2={y(0.5)}
        stroke="black"
        strokeWidth={1.4}
        strokeDasharray={"6 4"}
      />
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={getLineID(pmIDPrefix, featureName)}
          id={getLineID(pmIDPrefix, featureName)}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i]}
        />
      ))}
      <FeatureIndicators
        featureNames={upDayRatioFeatures}
        features={features}
        valueFormatFn={digitToPercent}
        labels={legendLabels}
        toggleFn={toggleFeature}
      />
    </>
  );
}
