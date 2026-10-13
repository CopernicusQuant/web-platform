import * as d3 from "d3";
import type { MACDFeature } from "@/apis";
import {
  getBarGroupID,
  getCircleID,
  getCrossLinesID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "@plot/interactions/d3-utils";
import { animationConfig, priceColors } from "@plot/theme";

const crossSignalFeatures = ["gold", "dead"] as const;
const emaFeatures = ["emaFast", "emaSlow"] as const;
const accelerationFeatures = ["diff", "dea"] as const;

const macdIDPrefix = "macd";
const toggleMACDFeature = (featureName: string) => {
  toggleElement(getLineID(macdIDPrefix, featureName));
  toggleElement(getCrossLinesID(macdIDPrefix, `${featureName}-price`));
  toggleElement(getCrossLinesID(macdIDPrefix, `${featureName}-feature`));
  toggleElement(getLegendID(macdIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getCircleID(macdIDPrefix, featureName));
  toggleElement(getBarGroupID(macdIDPrefix, featureName));
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
  [...emaFeatures].forEach((featureName) => {
    const xPos = (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2;
    const yPos = y(currFeature[featureName]) ?? 0;
    const currCircle = d3.select(`#${getCircleID(macdIDPrefix, featureName)}`);
    currCircle
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr("cx", xPos)
      .attr("cy", yPos);
    if (currCircle.attr("data-on") !== "off") {
      d3.select(`#${getCircleID(macdIDPrefix, featureName)}`).attr(
        "opacity",
        yPos <= height - marginBottom && yPos >= marginTop ? 1 : 0,
      );
    }
    updateTextValue(
      getLegendValueID(macdIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });
  [...accelerationFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(macdIDPrefix, featureName),
      currFeature[featureName].toFixed(3),
    );
  });
  const histValue = currFeature["hist"];
  updateTextValue(getLegendValueID(macdIDPrefix, "hist"), histValue.toFixed(3));
  const histLegend = d3.select(`#${getLegendID(macdIDPrefix, "hist")}`);
  histLegend
    .select("rect")
    .attr("stroke", histValue >= 0 ? priceColors.up : priceColors.down);
  histLegend
    .select("text")
    .attr("fill", histValue >= 0 ? priceColors.up : priceColors.down);
};

const resetMACDIndicators = ({ features }: { features: MACDFeature[] }) => {
  [...emaFeatures].forEach((featureName) => {
    d3.select(`#${getCircleID(macdIDPrefix, featureName)}`).attr("opacity", 0);
    updateTextValue(
      getLegendValueID(macdIDPrefix, featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });
  [...accelerationFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(macdIDPrefix, featureName),
      features.at(-1)![featureName].toFixed(3),
    );
  });

  const histValue = features.at(-1)!["hist"];
  updateTextValue(getLegendValueID(macdIDPrefix, "hist"), histValue.toFixed(3));
  const histLegend = d3.select(`#${getLegendID(macdIDPrefix, "hist")}`);
  histLegend
    .select("rect")
    .attr("stroke", histValue >= 0 ? priceColors.up : priceColors.down);
  histLegend
    .select("text")
    .attr("fill", histValue >= 0 ? priceColors.up : priceColors.down);
};

export {
  crossSignalFeatures,
  emaFeatures,
  accelerationFeatures,
  macdIDPrefix,
  toggleMACDFeature,
  updateMACDIndicators,
  resetMACDIndicators,
};
