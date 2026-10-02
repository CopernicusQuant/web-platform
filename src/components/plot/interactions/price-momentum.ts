import * as d3 from "d3";

import type { FeatureByGroup } from "@/apis/stock";
import { animationConfig } from "@/components/plot/theme";
import { updateTextValue } from "./d3-utils";
type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

const maFeatures = ["ma5", "ma20", "ma60"] as const;
const maBiasFeatures = ["ma5Bias", "ma20Bias", "ma60Bias"] as const;
const returnFeatures = ["return5d", "return20d", "return60d"] as const;
const upDayRatioFeatures = ["upRatio5d", "upRatio20d"] as const;
const maColors = ["#C5B3D3", "#F38181", "#93BFCF", "#FCE38A"];

const idPrefix = "price-momentum";
const maCircleGroupID = `${idPrefix}-circle-group`;
const getPMLineId = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getPMCircleId = (featureName: string) => `${idPrefix}-circle-${featureName}`;
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
      .duration(50)
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
};

const resetPriceMomentumIndicators = ({
  features,
}: {
  features: PriceMomentumFeature[];
}) => {
  const circleGroup = d3.select(`#${maCircleGroupID}`);
  circleGroup.attr("opacity", 0);
  if (!features.at(-1)) return;
  maFeatures.forEach((featureName) =>
    d3
      .select(`#${getPMLegendValueId(featureName)}`)
      .text(features.at(-1)![featureName].toFixed(2)),
  );
};

const toggleMALine = (featureName: (typeof maFeatures)[number]) => {
  const { duration } = animationConfig;
  const maLineID = getPMLineId(featureName);
  const maLegentID = getPMLegendId(featureName);
  const maCircleID = getPMCircleId(featureName);
  const currLine = d3.select(`#${maLineID}`);
  const currLegend = d3.select(`#${maLegentID}`);
  const currCircle = d3.select(`#${maCircleID}`);
  if (currLine.attr("opacity") != "0") {
    currLine.transition().duration(duration).attr("opacity", "0");
    currCircle.transition().duration(duration).attr("opacity", "0");
    currLegend.transition().duration(duration).attr("opacity", "0.3");
  } else {
    currLine.transition().duration(duration).attr("opacity", "0.7");
    currCircle.transition().duration(duration).attr("opacity", "1.0");
    currLegend.transition().duration(duration).attr("opacity", "1.0");
  }
};

export {
  maCircleGroupID,
  maColors,
  maFeatures,
  maBiasFeatures,
  returnFeatures,
  upDayRatioFeatures,
  getPMCircleId,
  getPMLineId,
  getPMLegendId,
  getPMLegendValueId,
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
  toggleMALine,
};
