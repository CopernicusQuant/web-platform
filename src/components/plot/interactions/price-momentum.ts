import * as d3 from "d3";

import type { FeatureByGroup } from "@/apis/stock";
import { animationConfig, priceColors } from "@/components/plot/theme";
import { toggleElement, updateTextValue } from "@/components/plot/interactions/d3-utils";
import { digitToPercent } from "@/lib/utils";
type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

const maFeatures = ["ma5", "ma20", "ma60"] as const;
const maBiasFeatures = ["ma5Bias", "ma20Bias", "ma60Bias"] as const;
const returnFeatures = ["return5d", "return20d", "return60d"] as const;
const upDayRatioFeatures = ["upRatio5d", "upRatio20d"] as const;

const idPrefix = "price-momentum";
const maCircleGroupID = `${idPrefix}-circle-group`;
const getPMLineId = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getPMCircleId = (featureName: string) => `${idPrefix}-circle-${featureName}`;
const getPMBarGroupId = (featureName: string) => `${idPrefix}-bars-${featureName}`;
const getPMLegendId = (featureName: string) => `${idPrefix}-legend-${featureName}`;
const getPMLegendValueId = (featureName: string) =>
  `${idPrefix}-legend-text-${featureName}`;

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
  const circleGroup = d3.select(`#${maCircleGroupID}`);
  circleGroup.attr("opacity", 1);
  const currFeature = features[xIdx];
  maFeatures.forEach((featureName) => {
    // update circle visibility and position
    const xPos = (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2;
    const yPos = y(currFeature[featureName]) ?? 0;
    const currCircle = circleGroup.select(`#${getPMCircleId(featureName)}`);
    const currLineOpacity = d3.select(`#${getPMLineId(featureName)}`).attr("opacity");
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
    updateTextValue(getPMLegendValueId(featureName), currFeature[featureName].toFixed(2));
  });
  [...maBiasFeatures, ...upDayRatioFeatures, ...returnFeatures].forEach((featureName) => {
    updateTextValue(
      getPMLegendValueId(featureName),
      digitToPercent(currFeature[featureName]),
    );
  });
  returnFeatures.forEach((featureName) => {
    const currColor = currFeature[featureName] >= 0 ? priceColors.up : priceColors.down;
    const legendGroup = d3
      .select(`#${getPMLegendId(featureName)}`)
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
  const circleGroup = d3.select(`#${maCircleGroupID}`);
  circleGroup.attr("opacity", 0);
  if (!features.at(-1)) return;

  [...maBiasFeatures, ...upDayRatioFeatures, ...returnFeatures].forEach((featureName) => {
    updateTextValue(
      getPMLegendValueId(featureName),
      digitToPercent(features.at(-1)![featureName]),
    );
  });

  maFeatures.forEach((featureName) => {
    updateTextValue(
      getPMLegendValueId(featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });

  returnFeatures.forEach((featureName) => {
    const currColor =
      features.at(-1)![featureName] >= 0 ? priceColors.up : priceColors.down;
    const legendGroup = d3
      .select(`#${getPMLegendId(featureName)}`)
      .transition()
      .duration(duration);
    legendGroup.select("rect").attr("stroke", currColor);
    legendGroup.select("text").attr("fill", currColor);
  });
};

const toggleFeature = (featureName: string) => {
  toggleElement(getPMLineId(featureName));
  toggleElement(getPMLegendId(featureName), 0.3, 1.0);
  toggleElement(getPMCircleId(featureName));
  toggleElement(getPMBarGroupId(featureName));
};

export {
  maCircleGroupID,
  maFeatures,
  maBiasFeatures,
  returnFeatures,
  upDayRatioFeatures,
  getPMCircleId,
  getPMLineId,
  getPMLegendId,
  getPMLegendValueId,
  getPMBarGroupId,
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
  toggleFeature,
};
