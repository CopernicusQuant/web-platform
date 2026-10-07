import type { FeatureGroupOpt } from "@/apis/stock";

const featureGroupDisplayName: Record<FeatureGroupOpt, string> = {
  priceMomentum: "Price Momentum",
  marketActivity: "Market Activity",
};

const featureGroupBrief: Record<FeatureGroupOpt, string> = {
  priceMomentum: "moving averages, deviations, returns, and up-day ratios",
  marketActivity: "",
};

const featureGroupDescription: Record<FeatureGroupOpt, string> = {
  priceMomentum:
    "This feature group measures price momentum using moving averages, deviations, returns, and up-day ratios to help predict future price movement from the direction, strength, and persistence of recent trends.",
  marketActivity: "",
};

export { featureGroupDisplayName, featureGroupDescription, featureGroupBrief };
