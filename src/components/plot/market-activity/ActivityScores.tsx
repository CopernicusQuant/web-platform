import { useTranslation } from "react-i18next";
import {
  activityScoreFeatures,
  marketIDPrefix,
  toggleFeature,
} from "@plot/interactions/market-activity";
import { colorPalette, plotSizeConfig } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import MarketFeatureIndicators from "@plot/market-activity/MarketFeatureIndicators";
import type { SubplotProps } from "@/components/shared";
import { getLineID, getPaths, getYScale } from "@plot/interactions/d3-utils";

export default function ActivityScores({
  features,
  x,
  width,
  height,
}: SubplotProps<"marketActivity">) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const values = features.reduce((acc, feature) => {
    activityScoreFeatures.forEach((featureName) => acc.push(feature[featureName]));
    return acc;
  }, [] as number[]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"marketActivity">(features, activityScoreFeatures, x, y);

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={getLineID(marketIDPrefix, featureName)}
          id={getLineID(marketIDPrefix, featureName)}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i]}
        />
      ))}
      <MarketFeatureIndicators
        featureNames={activityScoreFeatures}
        features={features}
        labels={activityScoreFeatures.map((featureName) =>
          t(`featureName.${featureName}`),
        )}
        wide={true}
        toggleFn={toggleFeature}
      />
      {/* 0.8 indicator */}
      {y.domain()[1] >= 0.8 && (
        <line
          x1={marginLeft}
          x2={width - marginRight}
          y1={y(0.8)}
          y2={y(0.8)}
          stroke="black"
          strokeWidth={1.4}
          strokeDasharray={"6 4"}
        />
      )}
    </>
  );
}
