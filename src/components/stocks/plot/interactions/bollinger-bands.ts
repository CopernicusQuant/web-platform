import * as d3 from "d3";
import type { BollingerBandsFeature } from "@/apis";
import {
  getCircleID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateCircleOpacity,
  updateCirclePos,
  updateTextValue,
} from "./d3-utils";
import { animationConfig } from "@/lib/theme";

const bandFeatures = ["bbUpper", "bbLower", "bbMid"] as const;
const positionFeature = "bbPos" as const;
const widthFeature = "bbWidth" as const;

const bbIDPrefix = "bb";
const getBBGroupID = () => `${bbIDPrefix}-band`;

const toggleBand = () => {
  toggleElement(getBBGroupID());
  toggleElement(getLegendID(bbIDPrefix, "band"), 0.3, 1.0);
};

const toggleBBFeature = (featureName: string) => {
  toggleElement(getLineID(bbIDPrefix, featureName));
  toggleElement(getLegendID(bbIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getCirclesGroupID("bbMid"));
};

const updateIndicators = (
  feature: BollingerBandsFeature,
  hovering: boolean,
  x?: d3.ScaleBand<string>,
  y?: d3.ScaleLinear<number, number>,
) => {
  const { duration } = animationConfig;
  updateTextValue(
    getLegendValueID(bbIDPrefix, "band"),
    `L ${feature["bbLower"].toFixed(2)} U ${feature["bbUpper"].toFixed(2)}`,
  );
  [...bandFeatures, positionFeature, widthFeature].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(bbIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
  });
  updateCircleOpacity(getCirclesGroupID("bbMid"), hovering);
  if (x && y) {
    updateCirclePos(
      getCircleID(bbIDPrefix, "bbMid"),
      duration,
      (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2,
      y(feature.bbMid),
    );
  }
};

const updateBBIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: BollingerBandsFeature[];
  xIdx: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  updateIndicators(features[xIdx], true, x, y);
};

const resetBBIndicators = ({ features }: { features: BollingerBandsFeature[] }) => {
  const currFeature = features.at(-1)!;
  updateIndicators(currFeature, false);
};

export {
  bandFeatures,
  positionFeature,
  widthFeature,
  bbIDPrefix,
  getBBGroupID,
  toggleBBFeature,
  toggleBand,
  updateBBIndicators,
  resetBBIndicators,
};
