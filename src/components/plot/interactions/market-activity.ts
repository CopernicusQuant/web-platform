const activityScoreFeatures = [
  "tradingActivityScore",
  "lowLiquidityVolatilityScore",
  "stagnantTurnoverScore",
] as const;

const activityFeatureNames = {
  tradingActivityScore: "Trading Activity",
  lowLiquidityVolatilityScore: "Low Liquidity Volatility",
  stagnantTurnoverScore: "Stagnant Turnover",
};

const idPrefix = "market-activity";
const getMarketLineID = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getMarketLegendID = (featureName: string) => `${idPrefix}-legend-${featureName}`;
const getMarketLegendValueID = (featureName: string) =>
  `${idPrefix}-legend-text-${featureName}`;

export {
  activityScoreFeatures,
  activityFeatureNames,
  getMarketLineID,
  getMarketLegendID,
  getMarketLegendValueID,
};
