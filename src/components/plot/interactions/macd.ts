import * as d3 from "d3";
import type { MACDFeature } from "@/apis";
import { toggleElement, updateTextValue } from "./d3-utils";
import { animationConfig } from "../theme";

const crossSignalFeatures = ["gold", "dead"] as const;
const emaFeatures = ["emaFast", "emaSlow"] as const;

const idPrefix = "macd";
const getMACDLineID = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getMACDCrossLinesID = (featureName: string) =>
  `${idPrefix}-cross-lines-${featureName}`;
const getMACDLegendID = (featureName: string) => `${idPrefix}-legend-${featureName}`;
const getMACDLegendValueID = (featureName: string) =>
  `${idPrefix}-legend-text-${featureName}`;
const getMACDCirclesGroupID = () => `${idPrefix}-ema-circles`;
const getMACDCircleID = (featureName: string) => `${idPrefix}-circle-${featureName}`;

const toggleMACDFeature = (featureName: string) => {
  toggleElement(getMACDLineID(featureName));
  toggleElement(getMACDCrossLinesID(featureName));
  toggleElement(getMACDLegendID(featureName), 0.3, 1.0);
  toggleElement(getMACDCircleID(featureName));
};

const updateMACDIndicators = ({
  features,
  xIdx,
  height,
  marginTop,
  marginBottom,
  x,
  y,
}: {
  features: MACDFeature[];
  xIdx: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const { duration } = animationConfig;
  const currFeature = features[xIdx];
  // show dots on the curve
  d3.select(`#${getMACDCirclesGroupID()}`).attr("opacity", 1);
  [...emaFeatures].forEach((featureName) => {
    const xPos = (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2;
    const yPos = y(currFeature[featureName]) ?? 0;
    d3.select(`#${getMACDCircleID(featureName)}`)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("cx", xPos)
      .attr("cy", yPos)
      .attr("opacity", yPos <= height - marginBottom && yPos >= marginTop ? 1 : 0);
    updateTextValue(
      getMACDLegendValueID(featureName),
      currFeature[featureName].toFixed(2),
    );
  });
};

const resetMACDIndicators = ({ features }: { features: MACDFeature[] }) => {
  d3.select(`#${getMACDCirclesGroupID()}`).attr("opacity", 0);
  [...emaFeatures].forEach((featureName) => {
    updateTextValue(
      getMACDLegendValueID(featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });
};

export {
  crossSignalFeatures,
  emaFeatures,
  getMACDLineID,
  getMACDCrossLinesID,
  getMACDLegendID,
  getMACDLegendValueID,
  getMACDCirclesGroupID,
  getMACDCircleID,
  toggleMACDFeature,
  updateMACDIndicators,
  resetMACDIndicators,
};
