import * as d3 from "d3";
import type { BollingerBandsFeature } from "@/apis";
import {
  getCircleID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "./d3-utils";
import { animationConfig } from "@plot/theme";

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
    getLegendValueID(bbIDPrefix, "band"),
    `L ${currFeature["bbLower"].toFixed(2)} U ${currFeature["bbUpper"].toFixed(2)}`,
  );
  [...bandFeatures, positionFeature, widthFeature].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(bbIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });
  // update circle position
  const circleGroup = d3.select(`#${getCirclesGroupID("bbMid")}`);
  if (circleGroup.attr("data-on") !== "off") {
    d3.select(`#${getCirclesGroupID("bbMid")}`).attr("opacity", 1);
  }
  d3.select(`#${getCircleID(bbIDPrefix, "bbMid")}`)
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
    getLegendValueID(bbIDPrefix, "band"),
    `L ${currFeature["bbLower"].toFixed(2)} U ${currFeature["bbUpper"].toFixed(2)}`,
  );
  [...bandFeatures, positionFeature, widthFeature].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(bbIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });

  // update circle position
  d3.select(`#${getCirclesGroupID("bbMid")}`).attr("opacity", 0);
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
