import type { RSIFeature } from "@/apis";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "./d3-utils";

const rsiIDPrefix = "rsi";
const rsiFeatures = ["rsi6", "rsi14"] as const;

const toggleRSIFeature = (featureName: string) => {
  toggleElement(getLineID(rsiIDPrefix, featureName));
  toggleElement(getLegendID(rsiIDPrefix, featureName), 0.3, 1.0);
};

const updateIndicator = (feature: RSIFeature) => {
  rsiFeatures.map((featureName) => {
    updateTextValue(
      getLegendValueID(rsiIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
  });
};

const updateRSIIndicators = ({
  features,
  xIdx,
}: {
  features: RSIFeature[];
  xIdx: number;
}) => {
  const currFeature = features[xIdx];
  updateIndicator(currFeature);
};

const resetRSIIndicators = ({ features }: { features: RSIFeature[] }) => {
  const currFeature = features.at(-1)!;
  updateIndicator(currFeature);
};

export {
  rsiFeatures,
  rsiIDPrefix,
  toggleRSIFeature,
  updateRSIIndicators,
  resetRSIIndicators,
};
