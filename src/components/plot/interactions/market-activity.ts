import type { MarketActivityFeature } from "@/apis/stock";
import { toggleElement, updateTextValue } from "@/components/plot/interactions/d3-utils";

const activityScoreFeatures = [
  "tradingActivityScore",
  "lowLiquidityVolatilityScore",
  "stagnantTurnoverScore",
] as const;

const idPrefix = "market-activity";
const getMarketLineID = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getMarketLegendID = (featureName: string) => `${idPrefix}-legend-${featureName}`;
const getMarketLegendValueID = (featureName: string) =>
  `${idPrefix}-legend-text-${featureName}`;

const toggleFeature = (featureName: string) => {
  toggleElement(getMarketLineID(featureName));
  toggleElement(getMarketLegendID(featureName), 0.3, 1.0);
};

const updateMarketActivityIndicators = ({
  features,
  xIdx,
}: {
  features: MarketActivityFeature[];
  xIdx: number;
}) => {
  const currFeature = features[xIdx];
  [...activityScoreFeatures].forEach((featureName) => {
    updateTextValue(
      getMarketLegendValueID(featureName),
      currFeature[featureName].toFixed(2),
    );
  });
};

const resetMarketActivityIndicators = ({
  features,
}: {
  features: MarketActivityFeature[];
}) => {
  [...activityScoreFeatures].forEach((featureName) => {
    updateTextValue(
      getMarketLegendValueID(featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });
};

export {
  activityScoreFeatures,
  getMarketLineID,
  getMarketLegendID,
  getMarketLegendValueID,
  toggleFeature,
  updateMarketActivityIndicators,
  resetMarketActivityIndicators,
};
