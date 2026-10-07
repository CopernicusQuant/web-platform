import * as d3 from "d3";
import type { MarketActivityFeature } from "@/apis/stock";
import {
  activityFeatureNames,
  activityScoreFeatures,
  getMarketLineID,
} from "../interactions/market-activity";
import { colorPalette, plotSizeConfig } from "../theme";
import YAxis from "../YAxis";
import MarketFeatureIndicators from "./MarketFeatureIndicators";

type ActivityScoresProps = {
  features: MarketActivityFeature[];
  x: d3.ScaleBand<string>;
  width: number;
  height: number;
};

export default function ActivityScores({
  features,
  x,
  width,
  height,
}: ActivityScoresProps) {
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
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      {Object.entries(paths).map(([key, value], i) => (
        <path
          key={getMarketLineID(key)}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i]}
        />
      ))}
      <MarketFeatureIndicators
        featureNames={activityScoreFeatures}
        features={features}
        labels={activityScoreFeatures.map(
          (featureName) => activityFeatureNames[featureName],
        )}
        wider={true}
      />
    </>
  );
}
