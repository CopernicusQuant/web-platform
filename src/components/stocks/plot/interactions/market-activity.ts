import type { MarketActivityFeature, StockPrice } from "@/apis";
import {
  getBarGroupID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "@stocks/plot/interactions/d3-utils";

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
const updateIndicators = (price: StockPrice, feature: MarketActivityFeature) => {
  const currFeature = feature;
  const currStockPrice = price;
  updateTextValue(
    getLegendValueID(marketIDPrefix, "turnover"),
    currStockPrice["turnover"].toFixed(2),
  );
  [...activityScoreFeatures, ...priceAndTurnoverFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(marketIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });
  amplitudeFeatures.forEach((featureName) => {
    updateTextValue(
      getLegendValueID(marketIDPrefix, featureName),
      `${(currFeature[featureName] * 100).toFixed(2)}%`,
    );
  });
};

const updateMarketActivityIndicators = ({
  prices,
  features,
  xIdx,
}: {
  prices: StockPrice[];
  features: MarketActivityFeature[];
  xIdx: number;
}) => {
  const currFeature = features[xIdx];
  const currStockPrice = prices[xIdx];
  updateIndicators(currStockPrice, currFeature);
};

const resetMarketActivityIndicators = ({
  prices,
  features,
}: {
  prices: StockPrice[];
  features: MarketActivityFeature[];
}) => {
  const currFeature = features.at(-1);
  const currStockPrice = prices.at(-1);
  if (!currFeature || !currStockPrice) return;
  updateIndicators(currStockPrice, currFeature);
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
