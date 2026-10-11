import * as d3 from "d3";
import type { BollingerBandsFeature } from "@/apis";
import { toggleElement, updateTextValue } from "./d3-utils";
import { animationConfig } from "@plot/theme";

const bandFeatures = ["bbUpper", "bbLower", "bbMid"] as const;
const positionFeature = "bbPos" as const;
const widthFeature = "bbWidth" as const;

const idPrefix = "bb";
const getBBGroupID = () => `${idPrefix}-band`;
const getBBLineID = (featureName: string) => `${idPrefix}-line-${featureName}`;
const getBBCircleID = (featureName: string) => `${idPrefix}-circle-${featureName}`;
const getBBCircleGroupID = (featureName: string) =>
  `${idPrefix}-circle-group-${featureName}`;
const getBBLegendID = (featureName: string) => `${idPrefix}-legend-${featureName}`;
const getBBLegendValueID = (featureName: string) =>
  `${idPrefix}-legend-value-${featureName}`;

const toggleBand = () => {
  toggleElement(getBBGroupID());
  toggleElement(getBBLegendID("band"), 0.3, 1.0);
};

const toggleBBFeature = (featureName: string) => {
  toggleElement(getBBLineID(featureName));
  toggleElement(getBBLegendID(featureName), 0.3, 1.0);
};

const updateBBIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: BollingerBandsFeature[];
  xIdx: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const { duration } = animationConfig;
  const currFeature = features[xIdx];
  updateTextValue(
    getBBLegendValueID("band"),
    `L ${currFeature["bbLower"].toFixed(2)} U ${currFeature["bbUpper"].toFixed(2)}`,
  );
  [...bandFeatures, positionFeature, widthFeature].forEach((featureName) => {
    updateTextValue(getBBLegendValueID(featureName), currFeature[featureName].toFixed(2));
  });
  // update circle position
  d3.select(`#${getBBCircleGroupID("bbMid")}`).attr("opacity", 1);
  d3.select(`#${getBBCircleID("bbMid")}`)
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr("cx", (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2)
    .attr("cy", y(currFeature.bbMid))
    .attr(
      "opacity",
      currFeature.bbMid >= y.domain()[0] && currFeature.bbMid <= y.domain()[1] ? 1 : 0,
    );
};

const resetBBIndicators = ({ features }: { features: BollingerBandsFeature[] }) => {
  const currFeature = features.at(-1)!;
  updateTextValue(
    getBBLegendValueID("band"),
    `L ${currFeature["bbLower"].toFixed(2)} U ${currFeature["bbUpper"].toFixed(2)}`,
  );
  [...bandFeatures, positionFeature, widthFeature].forEach((featureName) => {
    updateTextValue(getBBLegendValueID(featureName), currFeature[featureName].toFixed(2));
  });

  // update circle position
  d3.select(`#${getBBCircleGroupID("bbMid")}`).attr("opacity", 0);
};

export {
  bandFeatures,
  positionFeature,
  widthFeature,
  getBBGroupID,
  getBBLineID,
  getBBCircleID,
  getBBCircleGroupID,
  getBBLegendID,
  getBBLegendValueID,
  toggleBBFeature,
  toggleBand,
  updateBBIndicators,
  resetBBIndicators,
};
