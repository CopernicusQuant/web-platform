import * as d3 from "d3";
import type { KDJFeature } from "@/apis";
import {
  getCircleID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateCircleOpacity,
  updateCirclePos,
  updateTextValue,
} from "./d3-utils";
import { animationConfig } from "@plot/theme";

const kdjLowHighFeatures = ["kdjHigh9", "kdjLow9"] as const;
const kdjCoreFeatures = ["kdjK", "kdjD", "kdjJ"] as const;
const kdjIDPrefix = "kdj";

const toggleKDJElement = (featureName: string) => {
  toggleElement(getLegendID(kdjIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getLineID(kdjIDPrefix, featureName));
  toggleElement(getCircleID(kdjIDPrefix, featureName));
};

const updateIndicators = (
  feature: KDJFeature,
  hovering: boolean,
  x?: d3.ScaleBand<string>,
  y?: d3.ScaleLinear<number, number>,
) => {
  const { duration } = animationConfig;
  [...kdjLowHighFeatures, ...kdjCoreFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(kdjIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
    updateCircleOpacity(getCircleID(kdjIDPrefix, featureName), hovering);
    if (x && y) {
      updateCirclePos(
        getCircleID(kdjIDPrefix, featureName),
        duration,
        (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2,
        y(feature[featureName]),
      );
    }
  });
};

const updateKDJIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: KDJFeature[];
  xIdx: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const currFeature = features.at(xIdx);
  if (!currFeature) return;
  updateIndicators(currFeature, true, x, y);
};

const resetKDJIndicators = ({ features }: { features: KDJFeature[] }) => {
  const lastFeature = features.at(-1);
  if (!lastFeature) return;
  updateIndicators(lastFeature, false);
};

export {
  kdjCoreFeatures,
  kdjLowHighFeatures,
  kdjIDPrefix,
  toggleKDJElement,
  updateKDJIndicators,
  resetKDJIndicators,
};
