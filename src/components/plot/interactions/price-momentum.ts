import * as d3 from "d3";

import type { FeatureByGroup } from "@/apis/stock";
type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

const maFeatures = ["ma5", "ma20", "ma60"] as const;
const maColors = ["#FCE38A", "#93BFCF", "#F38181", "#C5B3D3"];

const idPrefix = "price-momentum";
const maCircleGroupID = `${idPrefix}-circle-group`;
const getMALineId = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getMACircleId = (featureName: string) => `${idPrefix}-circle-${featureName}`;
const getMALegentId = (featureName: string) => `${idPrefix}-legend-${featureName}`;

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
    const xPos = (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2;
    const yPos = y(currFeature[featureName]) ?? 0;
    circleGroup
      .select(`#${getMACircleId(featureName)}`)
      .transition()
      .duration(50)
      .ease(d3.easeLinear)
      .attr("cx", xPos)
      .attr("cy", yPos)
      .attr("opacity", yPos <= height - marginBottom && yPos >= marginTop ? "1" : "0");
  });
};

const resetPriceMomentumIndicators = () => {
  const circleGroup = d3.select(`#${maCircleGroupID}`);
  circleGroup.attr("opacity", 0);
};

const toggleMALine = (featureName: (typeof maFeatures)[number]) => {
  const maLineID = getMALineId(featureName);
  const maLegentID = getMALegentId(featureName);
  const currLine = d3.select(`#${maLineID}`);
  const currLegend = d3.select(`#${maLegentID}`);
  if (currLine.attr("opacity") != "0") {
    currLine.transition().duration(50).attr("opacity", "0");
    currLegend.transition().duration(50).attr("opacity", "0.3");
  } else {
    currLine.transition().duration(50).attr("opacity", "0.7");
    currLegend.transition().duration(50).attr("opacity", "1.0");
  }
};

export {
  maCircleGroupID,
  maFeatures,
  maColors,
  getMACircleId,
  getMALineId,
  getMALegentId,
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
  toggleMALine,
};
