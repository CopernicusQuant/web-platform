import type { MarketActivityFeature, StockPrice } from "@/apis";
import {
  getBarGroupID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "@plot/interactions/d3-utils";

const activityScoreFeatures = [
  "tradingActivityScore",
  "lowLiquidityVolatilityScore",
  "stagnantTurnoverScore",
] as const;

const priceAndTurnoverFeatures = ["amplitudeQuantile", "turnoverQuantile"] as const;
const amplitudeFeatures = ["amplitude", "amplitudeMa5", "amplitudeMa20"] as const;

const marketIDPrefix = "market-activity";
const toggleFeature = (featureName: string) => {
  toggleElement(getLineID(marketIDPrefix, featureName));
  toggleElement(getLegendID(marketIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getBarGroupID(marketIDPrefix, featureName));
  toggleElement(getCirclesGroupID(featureName));
};

const updateMarketActivityIndicators = ({
  stock,
  features,
  xIdx,
}: {
  stock: StockPrice[];
  features: MarketActivityFeature[];
  xIdx: number;
}) => {
  const currFeature = features[xIdx];
  const currStockPrice = stock[xIdx];
  updateTextValue(
    getLegendValueID(marketIDPrefix, "turnover"),
    currStockPrice["turnover"].toFixed(2),
  );
  [...activityScoreFeatures, ...priceAndTurnoverFeatures, ...amplitudeFeatures].forEach(
    (featureName) => {
      updateTextValue(
        getLegendValueID(marketIDPrefix, featureName),
        currFeature[featureName].toFixed(2),
      );
    },
  );
  amplitudeFeatures.forEach((featureName) => {
    updateTextValue(
      getLegendValueID(marketIDPrefix, featureName),
      `${(currFeature[featureName] * 100).toFixed(2)}%`,
    );
  });
};

const resetMarketActivityIndicators = ({
  stock,
  features,
}: {
  stock: StockPrice[];
  features: MarketActivityFeature[];
}) => {
  updateTextValue(
    getLegendValueID(marketIDPrefix, "turnover"),
    stock.at(-1)!["turnover"].toFixed(2),
  );
  [...activityScoreFeatures, ...priceAndTurnoverFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(marketIDPrefix, featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });
  amplitudeFeatures.forEach((featureName) => {
    updateTextValue(
      getLegendValueID(marketIDPrefix, featureName),
      `${(features.at(-1)![featureName] * 100).toFixed(2)}%`,
    );
  });
};

export {
  activityScoreFeatures,
  priceAndTurnoverFeatures,
  amplitudeFeatures,
  marketIDPrefix,
  getLegendID,
  getLegendValueID,
  toggleFeature,
  updateMarketActivityIndicators,
  resetMarketActivityIndicators,
};
