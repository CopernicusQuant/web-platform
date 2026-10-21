import type { CCIFeature } from "@/apis";
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

const cciIDPrefix = "cci";
const cciTpFeatures = ["tp", "tpSma"] as const;
const cciCoreFeatures = ["cci", "cciMa5"] as const;

const toggleCCIElement = (featureName: string) => {
  toggleElement(getLegendID(cciIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getLineID(cciIDPrefix, featureName));
  toggleElement(getCircleID(cciIDPrefix, featureName));
};

const updateIndicators = (
  feature: CCIFeature,
  hovering: boolean,
  x?: d3.ScaleBand<string>,
  y?: d3.ScaleLinear<number, number>,
) => {
  const { duration } = animationConfig;
  [...cciTpFeatures, ...cciCoreFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(cciIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
    updateCircleOpacity(getCircleID(cciIDPrefix, featureName), hovering);
    if (x && y) {
      updateCirclePos(
        getCircleID(cciIDPrefix, featureName),
        duration,
        (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2,
        y(feature[featureName]),
      );
    }
  });
};

const updateCCIIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: CCIFeature[];
  xIdx: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const currFeature = features.at(xIdx);
  if (!currFeature) return;
  updateIndicators(currFeature, true, x, y);
};

const resetCCIIndicators = ({ features }: { features: CCIFeature[] }) => {
  const lastFeature = features.at(-1);
  if (!lastFeature) return;
  updateIndicators(lastFeature, false);
};

export {
  cciIDPrefix,
  cciTpFeatures,
  cciCoreFeatures,
  toggleCCIElement,
  updateCCIIndicators,
  resetCCIIndicators,
};
