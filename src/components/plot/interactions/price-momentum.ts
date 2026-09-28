import * as d3 from "d3";

import type { FeatureByGroup } from "@/apis/stock";
type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

const maFeatures = ["ma5", "ma10", "ma20", "ma60"] as const;
const maColors = ["#F38181", "#FCE38A", "#93BFCF", "#C5B3D3"];

const idPrefix = "price-momentum";
const maCircleGroupID = `${idPrefix}-circle-group`;
const getMALineId = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getMACircleId = (featureName: string) => `${idPrefix}-circle-${featureName}`;

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
      .attr("cy", yPos);
  });
};

const resetPriceMomentumIndicators = () => {
  const circleGroup = d3.select(`#${maCircleGroupID}`);
  circleGroup.attr("opacity", 0);
};

export {
  maCircleGroupID,
  maFeatures,
  maColors,
  getMACircleId,
  getMALineId,
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
};
