import type { FeatureByGroup, FeatureGroupOpt } from "@/apis";
import * as d3 from "d3";

const getLineID = (idPrefix: string, featureName: string) =>
  `${idPrefix}-line-${featureName}`;
const getCrossLinesID = (idPrefix: string, featureName: string) =>
  `${idPrefix}-cross-lines-${featureName}`;
const getLegendID = (idPrefix: string, featureName: string) =>
  `${idPrefix}-legend-${featureName}`;
const getLegendValueID = (idPrefix: string, featureName: string) =>
  `${idPrefix}-legend-text-${featureName}`;
const getCirclesGroupID = (idPrefix: string) => `${idPrefix}-circles`;
const getCircleID = (idPrefix: string, featureName: string) =>
  `${idPrefix}-circle-${featureName}`;
const getBarGroupID = (idPrefix: string, featureName: string) =>
  `${idPrefix}-bars-${featureName}`;

const updateTextValue = (id: string, text: string) => {
  d3.select(`#${id}`).text(text);
};

const updateCircleOpacity = (id: string, hovering: boolean) => {
  const circleGroup = d3.select(`#${id}`);
  if (circleGroup.empty()) return;
  if (circleGroup.attr("data-on") !== "off") {
    circleGroup.attr("opacity", hovering ? 1 : 0);
  }
};

const updateCirclePos = (id: string, duration: number, cx: number, cy: number) => {
  const circle = d3.select(`#${id}`);
  circle
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr("cx", cx)
    .attr("cy", cy);
};

const toggleElement = (
  id: string,
  hiddenOpacity: number = 0,
  visibleOpacity: number = 1.0,
) => {
  // const { duration } = animationConfig;
  const element = d3.select(`#${id}`);
  if (element.empty()) return;
  const currState = element.attr("data-on") ?? "on";
  if (currState === "on") {
    element.attr("opacity", Math.max(0.0, hiddenOpacity));
  } else {
    element.attr("opacity", Math.min(1.0, visibleOpacity));
  }
  element.attr("data-on", currState === "on" ? "off" : "on");
};

const getYScale = (
  values: number[],
  low: number,
  high: number,
): d3.ScaleLinear<number, number> => {
  let [yMax, yMin] = [-Infinity, Infinity];
  values.forEach((value) => {
    yMax = Math.max(yMax, value);
    yMin = Math.min(yMin, value);
  });
  const yPadding = (yMax - yMin) * 0.05 || 1;
  // this line avoids wrong y scale before the plot got a proper height
  const range = low >= high ? [low, high] : [0, 0];
  const y = d3.scaleLinear([yMin - yPadding, yMax + yPadding], range);
  return y;
};

const getFeatureValues = <G extends FeatureGroupOpt>(
  features: FeatureByGroup[G][],
  featureNames: readonly (keyof FeatureByGroup[G])[],
) => {
  const featureValues = features.reduce((acc, feature) => {
    featureNames.forEach((featureName) => acc.push(feature[featureName] as number));
    return acc;
  }, [] as number[]);
  return featureValues;
};

const getPaths = <G extends FeatureGroupOpt>(
  features: FeatureByGroup[G][],
  featureNames: readonly (keyof FeatureByGroup[G])[],
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number>,
) => {
  const paths: Record<string, string> = {};
  featureNames.forEach((featureName) => {
    const path = d3
      .line<FeatureByGroup[G]>()
      .defined(
        (feature) =>
          (feature[featureName] as number) >= y.domain()[0] &&
          (feature[featureName] as number) <= y.domain()[1],
      )
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName] as number))(features);
    if (path != null) paths[featureName as string] = path;
  });
  return paths;
};

export {
  updateCirclePos,
  updateCircleOpacity,
  updateTextValue,
  toggleElement,
  getFeatureValues,
  getLineID,
  getCrossLinesID,
  getLegendID,
  getLegendValueID,
  getCirclesGroupID,
  getCircleID,
  getBarGroupID,
  getYScale,
  getPaths,
};
