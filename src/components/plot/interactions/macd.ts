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
  updateCircleOpacity,
  updateCirclePos,
  updateLegendColor,
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

const updateIndicators = (
  feature: MACDFeature,
  hovering: boolean,
  x?: d3.ScaleBand<string>,
  y?: d3.ScaleLinear<number, number>,
) => {
  const { duration } = animationConfig;
  [...emaFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(macdIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
    if (x && y) {
      const xPos = (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2;
      const yPos = y(feature[featureName]) ?? 0;
      const circleOpacity = yPos <= y.range()[0] && yPos >= y.range()[1] ? 1 : 0;
      updateCircleOpacity(
        getCircleID(macdIDPrefix, featureName),
        hovering,
        circleOpacity,
      );
      updateCirclePos(getCircleID(macdIDPrefix, featureName), duration, xPos, yPos);
    } else {
      updateCircleOpacity(getCircleID(macdIDPrefix, featureName), hovering);
    }
  });
  [...accelerationFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(macdIDPrefix, featureName),
      feature[featureName].toFixed(3),
    );
  });
  const histValue = feature["hist"];
  updateTextValue(getLegendValueID(macdIDPrefix, "hist"), histValue.toFixed(3));
  // update legend color
  const legendColor = histValue >= 0 ? priceColors.up : priceColors.down;
  updateLegendColor(getLegendID(macdIDPrefix, "hist"), legendColor);
};

const updateMACDIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: MACDFeature[];
  xIdx: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const currFeature = features[xIdx];
  updateIndicators(currFeature, true, x, y);
};

const resetMACDIndicators = ({ features }: { features: MACDFeature[] }) => {
  const lastFeature = features.at(-1);
  if (!lastFeature) return;
  updateIndicators(lastFeature, false);
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
