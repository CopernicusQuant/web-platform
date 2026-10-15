import * as d3 from "d3";
import { useTranslation } from "react-i18next";
import type { MarketActivityFeature } from "@/apis";
import {
  activityScoreFeatures,
  marketIDPrefix,
  toggleFeature,
} from "@plot/interactions/market-activity";
import { colorPalette, plotSizeConfig } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import MarketFeatureIndicators from "@plot/market-activity/MarketFeatureIndicators";
import type { SubplotProps } from "@plot/shared";
import { getLineID } from "@plot/interactions/d3-utils";

export default function ActivityScores({
  features,
  x,
  width,
  height,
}: SubplotProps<"marketActivity">) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  let [yMax, yMin] = [-Infinity, Infinity];
  features.forEach((feature) => {
    activityScoreFeatures.forEach((featureName) => {
      yMax = Math.max(yMax, feature[featureName]);
      yMin = Math.min(yMin, feature[featureName]);
    });
  });
  const yPadding = (yMax - yMin) * 0.07 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  const paths: Record<string, string> = {};

  activityScoreFeatures.forEach((featureName) => {
    const path = d3
      .line<MarketActivityFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) {
      paths[featureName] = path;
    }
  });

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
