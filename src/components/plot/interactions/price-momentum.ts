import * as d3 from "d3";

import type { FeatureByGroup } from "@/apis";
import { animationConfig, priceColors } from "@plot/theme";
import {
  getBarGroupID,
  getCircleID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateCircleOpacity,
  updateCirclePos,
  updateLegendColor,
  updateTextValue,
} from "@plot/interactions/d3-utils";
import { digitToPercent } from "@/lib/utils";
type PriceMomentumFeature = FeatureByGroup["pricemomentum"];

const maFeatures = ["ma5", "ma20", "ma60"] as const;
const maBiasFeatures = ["ma5Bias", "ma20Bias", "ma60Bias"] as const;
const returnFeatures = ["return5d", "return20d", "return60d"] as const;
const upDayRatioFeatures = ["upRatio5d", "upRatio20d"] as const;

const pmIDPrefix = "price-momentum";

const toggleFeature = (featureName: string) => {
  // the MA lines' rendering opacity are 0.7
  if (maFeatures.some((name) => name === featureName)) {
    toggleElement(getLineID(pmIDPrefix, featureName), 0.0, 0.7);
  } else {
    toggleElement(getLineID(pmIDPrefix, featureName));
  }
  toggleElement(getLegendID(pmIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getCircleID(pmIDPrefix, featureName));
  toggleElement(getBarGroupID(pmIDPrefix, featureName));
};

const updateIndicators = (
  feature: PriceMomentumFeature,
  hovering: boolean,
  x?: d3.ScaleBand<string>,
  y?: d3.ScaleLinear<number, number>,
) => {
  const { duration } = animationConfig;
  maFeatures.forEach((featureName) => {
    // update legend value
    updateTextValue(
      getLegendValueID(pmIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
    if (x && y) {
      // update circle visibility and position
      const xPos = (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2;
      const yPos = y(feature[featureName]) ?? 0;
      const opacity = yPos <= y.range()[0] && yPos >= y.range()[1] ? 1 : 0;
      updateCirclePos(getCircleID(pmIDPrefix, featureName), duration, xPos, yPos);
      updateCircleOpacity(getCircleID(pmIDPrefix, featureName), hovering, opacity);
    } else {
      updateCircleOpacity(getCircleID(pmIDPrefix, featureName), hovering);
    }
  });
  [...maBiasFeatures, ...upDayRatioFeatures, ...returnFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(pmIDPrefix, featureName),
      digitToPercent(feature[featureName]),
    );
  });
  returnFeatures.forEach((featureName) => {
    const currColor = feature[featureName] >= 0 ? priceColors.up : priceColors.down;
    updateLegendColor(getLegendID(pmIDPrefix, featureName), currColor);
  });
};

const updatePriceMomentumIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: PriceMomentumFeature[];
  xIdx: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const currFeature = features[xIdx];
  updateIndicators(currFeature, true, x, y);
};

const resetPriceMomentumIndicators = ({
  features,
}: {
  features: PriceMomentumFeature[];
}) => {
  const lastFeature = features.at(-1);
  if (!lastFeature) return;
  updateIndicators(lastFeature, false);
};

export {
  pmIDPrefix,
  maFeatures,
  maBiasFeatures,
  returnFeatures,
  upDayRatioFeatures,
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
  toggleFeature,
};
