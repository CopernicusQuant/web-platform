import * as d3 from "d3";
import { type DEMAFeature, type DEMAPeriodOpt } from "@/apis";
import {
  getCircleID,
  getCrossLinesID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "./d3-utils";
import { animationConfig } from "@plot/theme";
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

const updateDEMAIndicators = ({
  features,
  xIdx,
  height,
  marginTop,
  marginBottom,
  x,
  y,
}: {
  features: DEMAFeature[];
  xIdx: number;
  height: number;
  marginTop: number;
  marginBottom: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const { duration } = animationConfig;
  const currFeature = features[xIdx];
  const featureNames = Object.keys(currFeature) as DEMANumericFeatureName[];
  const slowFastFeatureNames = featureNames.filter(
    (featureName) => featureName.endsWith("fast") || featureName.endsWith("slow"),
  );
  const spreadFeatureName = featureNames.filter((featureName) =>
    featureName.endsWith("spread"),
  )[0];
  updateTextValue(
    getLegendValueID(demaIDPrefix, spreadFeatureName),
    digitToPercent(currFeature[spreadFeatureName]),
  );
  [...slowFastFeatureNames].forEach((featureName) => {
    const xPos = (x(currFeature.tradeDate) ?? 0) + x.bandwidth() / 2;
    const yPos = y(currFeature[featureName]) ?? 0;
    const currCircle = d3.select(`#${getCircleID(demaIDPrefix, featureName)}`);
    if (!currCircle.empty()) {
      currCircle
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("cx", xPos)
        .attr("cy", yPos);
      if (currCircle.attr("data-on") !== "off") {
        d3.select(`#${getCircleID(demaIDPrefix, featureName)}`).attr(
          "opacity",
          yPos <= height - marginBottom && yPos >= marginTop ? 1 : 0,
        );
      }
    }
    updateTextValue(
      getLegendValueID(demaIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });
};

const resetDEMAIndicators = ({ features }: { features: DEMAFeature[] }) => {
  const featureNames = Object.keys(features.at(-1)!) as DEMANumericFeatureName[];
  const slowFastFeatureNames = featureNames.filter(
    (featureName) => featureName.endsWith("fast") || featureName.endsWith("slow"),
  );
  const spreadFeatureName = featureNames.filter((featureName) =>
    featureName.endsWith("spread"),
  )[0];
  updateTextValue(
    getLegendValueID(demaIDPrefix, spreadFeatureName),
    digitToPercent(features.at(-1)![spreadFeatureName]),
  );
  [...slowFastFeatureNames].forEach((featureName) => {
    d3.select(`#${getCircleID(demaIDPrefix, featureName)}`).attr("opacity", 0);
    updateTextValue(
      getLegendValueID(demaIDPrefix, featureName),
      features.at(-1)![featureName].toFixed(2),
    );
  });
};

export {
  demaIDPrefix,
  getDEMAFeatureNamesByPeriod,
  toggleDEMAFeature,
  updateDEMAIndicators,
  resetDEMAIndicators,
};
