import type { MarketActivityFeature, StockValues } from "@/apis";
import { toggleElement, updateTextValue } from "@/components/plot/interactions/d3-utils";

const activityScoreFeatures = [
  "tradingActivityScore",
  "lowLiquidityVolatilityScore",
  "stagnantTurnoverScore",
] as const;

const priceAndTurnoverFeatures = ["amplitudeQuantile", "turnoverQuantile"] as const;
const amplitudeFeatures = ["amplitude", "amplitudeMa5", "amplitudeMa20"] as const;

const idPrefix = "market-activity";
const getMarketLineID = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getMarketLegendID = (featureName: string) => `${idPrefix}-legend-${featureName}`;
const getMarketLegendValueID = (featureName: string) =>
  `${idPrefix}-legend-text-${featureName}`;
const getMarketBarGroupID = (featureName: string) => `${idPrefix}-bars-${featureName}`;
const getMarketCircleGroupID = (featureName: string) =>
  `${idPrefix}-circles-${featureName}`;

const toggleFeature = (featureName: string) => {
  toggleElement(getMarketLineID(featureName));
  toggleElement(getMarketLegendID(featureName), 0.3, 1.0);
  toggleElement(getMarketBarGroupID(featureName));
  toggleElement(getMarketCircleGroupID(featureName));
};

const updateMarketActivityIndicators = ({
  stock,
  features,
  xIdx,
}: {
  stock: StockValues[];
  features: MarketActivityFeature[];
  xIdx: number;
}) => {
  const currFeature = features[xIdx];
  const currStockValues = stock[xIdx];
  updateTextValue(
    getMarketLegendValueID("turnover"),
    currStockValues["turnover"].toFixed(2),
  );
  [...activityScoreFeatures, ...priceAndTurnoverFeatures, ...amplitudeFeatures].forEach(
    (featureName) => {
      updateTextValue(
        getMarketLegendValueID(featureName),
        currFeature[featureName].toFixed(2),
      );
    },
  );
  amplitudeFeatures.forEach((featureName) => {
    updateTextValue(
      getMarketLegendValueID(featureName),
      `${(currFeature[featureName] * 100).toFixed(2)}%`,
    );
  });
};

const resetMarketActivityIndicators = ({
  stock,
  features,
}: {
  stock: StockValues[];
  features: MarketActivityFeature[];
}) => {
  updateTextValue(
    getMarketLegendValueID("turnover"),
    stock.at(-1)!["turnover"].toFixed(2),
  );
  [...activityScoreFeatures, ...priceAndTurnoverFeatures].forEach((featureName) => {
    updateTextValue(
      getMarketLegendValueID(featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });
  amplitudeFeatures.forEach((featureName) => {
    updateTextValue(
      getMarketLegendValueID(featureName),
      `${(features.at(-1)![featureName] * 100).toFixed(2)}%`,
    );
  });
};

export {
  activityScoreFeatures,
  priceAndTurnoverFeatures,
  amplitudeFeatures,
  getMarketLineID,
  getMarketLegendID,
  getMarketLegendValueID,
  getMarketBarGroupID,
  getMarketCircleGroupID,
  toggleFeature,
  updateMarketActivityIndicators,
  resetMarketActivityIndicators,
};
