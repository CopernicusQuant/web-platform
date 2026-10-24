import * as d3 from "d3";
import { type DEMAFeature, type DEMAPeriodOpt } from "@/apis";
import {
  getCircleID,
  getCrossLinesID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateCircleOpacity,
  updateCirclePos,
  updateTextValue,
} from "./d3-utils";
import { animationConfig } from "@/lib/theme";
import { digitToPercent } from "@/lib/utils";

type DEMANumericFeatureName = {
  [K in keyof DEMAFeature]: DEMAFeature[K] extends number ? K : never;
}[keyof DEMAFeature];

const getDEMAFeatureNamesByPeriod = (period: DEMAPeriodOpt): DEMANumericFeatureName[] => {
  switch (period) {
    case "5_10":
      return [
        "dema_5_10_fast",
        "dema_5_10_slow",
        "dema_5_10_spread",
        "dema_5_10_dead",
        "dema_5_10_gold",
      ];
    case "10_20":
      return [
        "dema_10_20_fast",
        "dema_10_20_slow",
        "dema_10_20_spread",
        "dema_10_20_dead",
        "dema_10_20_gold",
      ];
    case "20_60":
      return [
        "dema_20_60_fast",
        "dema_20_60_slow",
        "dema_20_60_spread",
        "dema_20_60_dead",
        "dema_20_60_gold",
      ];
  }
};

const demaIDPrefix = "dema";

const toggleDEMAFeature = (featureName: string) => {
  toggleElement(getLineID(demaIDPrefix, featureName));
  toggleElement(getCrossLinesID(demaIDPrefix, `${featureName}-price`));
  toggleElement(getCrossLinesID(demaIDPrefix, `${featureName}-feature`));
  toggleElement(getLegendID(demaIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getCircleID(demaIDPrefix, featureName));
};

const updateIndicators = (
  feature: DEMAFeature,
  hovering: boolean,
  x?: d3.ScaleBand<string>,
  y?: d3.ScaleLinear<number, number>,
) => {
  const { duration } = animationConfig;
  const featureNames = Object.keys(feature) as DEMANumericFeatureName[];
  const slowFastFeatureNames = featureNames.filter(
    (featureName) => featureName.endsWith("fast") || featureName.endsWith("slow"),
  );
  const spreadFeatureNames = featureNames.filter((featureName) =>
    featureName.endsWith("spread"),
  );
  spreadFeatureNames.forEach((featureName) =>
    updateTextValue(
      getLegendValueID(demaIDPrefix, featureName),
      digitToPercent(feature[featureName]),
    ),
  );
  slowFastFeatureNames.forEach((featureName) => {
    updateTextValue(
      getLegendValueID(demaIDPrefix, featureName),
      feature[featureName].toFixed(2),
    );
    updateCircleOpacity(getCircleID(demaIDPrefix, featureName), hovering);
    if (x && y) {
      const xPos = (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2;
      const yPos = y(feature[featureName]) ?? 0;
      // when the circle moves out of the plot boundary, hide it
      const circleOpacity = yPos <= y.range()[0] && yPos >= y.range()[1] ? 1 : 0;
      updateCircleOpacity(
        getCircleID(demaIDPrefix, featureName),
        hovering,
        circleOpacity,
      );
      updateCirclePos(getCircleID(demaIDPrefix, featureName), duration, xPos, yPos);
    } else {
      updateCircleOpacity(getCircleID(demaIDPrefix, featureName), hovering);
    }
  });
};

const updateDEMAIndicators = ({
  features,
  xIdx,
  x,
  y,
}: {
  features: DEMAFeature[];
  xIdx: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const currFeature = features[xIdx];
  updateIndicators(currFeature, true, x, y);
};

const resetDEMAIndicators = ({ features }: { features: DEMAFeature[] }) => {
  const lastFeature = features.at(-1);
  if (!lastFeature) return;
  updateIndicators(lastFeature, false);
};

export {
  demaIDPrefix,
  getDEMAFeatureNamesByPeriod,
  toggleDEMAFeature,
  updateDEMAIndicators,
  resetDEMAIndicators,
};
