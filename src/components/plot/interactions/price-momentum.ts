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
  updateTextValue,
} from "@plot/interactions/d3-utils";
import { digitToPercent } from "@/lib/utils";
type PriceMomentumFeature = FeatureByGroup["pricemomentum"];

const maFeatures = ["ma5", "ma20", "ma60"] as const;
const maBiasFeatures = ["ma5Bias", "ma20Bias", "ma60Bias"] as const;
const returnFeatures = ["return5d", "return20d", "return60d"] as const;
const upDayRatioFeatures = ["upRatio5d", "upRatio20d"] as const;

const pmIDPrefix = "price-momentum";

const updatePriceMomentumIndicators = ({
  features,
  xIdx,
  height,
  marginTop,
  marginBottom,
  x,
  y,
}: {
  features: PriceMomentumFeature[];
  xIdx: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const { duration } = animationConfig;
  const currFeature = features[xIdx];
  maFeatures.forEach((featureName) => {
    // update circle visibility and position
    const xPos = (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2;
    const yPos = y(currFeature[featureName]) ?? 0;
    const currCircle = d3.select(`#${getCircleID(pmIDPrefix, featureName)}`);
    const currLineOpacity = d3
      .select(`#${getLineID(pmIDPrefix, featureName)}`)
      .attr("opacity");
    currCircle
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("cx", xPos)
      .attr("cy", yPos);
    if (currLineOpacity !== "0") {
      currCircle.attr(
        "opacity",
        yPos <= height - marginBottom && yPos >= marginTop ? "1" : "0",
      );
    }
    // update legend value
    updateTextValue(
      getLegendValueID(pmIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });
  [...maBiasFeatures, ...upDayRatioFeatures, ...returnFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(pmIDPrefix, featureName),
      digitToPercent(currFeature[featureName]),
    );
  });
  returnFeatures.forEach((featureName) => {
    const currColor = currFeature[featureName] >= 0 ? priceColors.up : priceColors.down;
    const legendGroup = d3
      .select(`#${getLegendID(pmIDPrefix, featureName)}`)
      .transition()
      .duration(duration);
    legendGroup.select("rect").attr("stroke", currColor);
    legendGroup.select("text").attr("fill", currColor);
  });
};

const resetPriceMomentumIndicators = ({
  features,
}: {
  features: PriceMomentumFeature[];
}) => {
  const { duration } = animationConfig;
  if (!features.at(-1)) return;

  [...maBiasFeatures, ...upDayRatioFeatures, ...returnFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(pmIDPrefix, featureName),
      digitToPercent(features.at(-1)![featureName]),
    );
  });

  maFeatures.forEach((featureName) => {
    d3.select(`#${getCircleID(pmIDPrefix, featureName)}`).attr("opacity", 0);
    updateTextValue(
      getLegendValueID(pmIDPrefix, featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });

  returnFeatures.forEach((featureName) => {
    const currColor =
      features.at(-1)![featureName] >= 0 ? priceColors.up : priceColors.down;
    const legendGroup = d3
      .select(`#${getLegendID(pmIDPrefix, featureName)}`)
      .transition()
      .duration(duration);
    legendGroup.select("rect").attr("stroke", currColor);
    legendGroup.select("text").attr("fill", currColor);
  });
};

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
