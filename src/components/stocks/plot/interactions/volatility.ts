import type { VolatilityFeature } from "@/apis";
import {
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "./d3-utils";

const volatilityIDPrefix = "volatility";
const volatilityLogFeature = "volatilityLog";
const volatilityRankFeature = "volatilityRank";

const toggleVolatilityFeature = (featureName: string) => {
  toggleElement(getLineID(volatilityIDPrefix, featureName));
  toggleElement(getCirclesGroupID(featureName));
  toggleElement(getLegendID(volatilityIDPrefix, featureName), 0.3, 0.7);
};

const updateIndicators = (feature: VolatilityFeature) => {
  ([volatilityLogFeature, volatilityRankFeature] as const).forEach((featureName) => {
    updateTextValue(
      getLegendValueID(volatilityIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
  });
};

const updateVolatilityIndicators = ({
  features,
  xIdx,
}: {
  features: VolatilityFeature[];
  xIdx: number;
}) => {
  const currFeature = features[xIdx];
  updateIndicators(currFeature);
};

const resetVolatilityIndicators = ({ features }: { features: VolatilityFeature[] }) => {
  const lastFeature = features.at(-1)!;
  updateIndicators(lastFeature);
};

export {
  volatilityIDPrefix,
  volatilityLogFeature,
  volatilityRankFeature,
  toggleVolatilityFeature,
  updateVolatilityIndicators,
  resetVolatilityIndicators,
};
