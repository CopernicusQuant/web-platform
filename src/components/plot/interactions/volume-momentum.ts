import * as d3 from "d3";
import type { StockPrice, VolumeMomentumFeature } from "@/apis";
import {
  getBarGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  toggleElement,
  updateTextValue,
} from "./d3-utils";
import { digitToPercent } from "@/lib/utils";
import { animationConfig, priceColors } from "@plot/theme";

const volBiasFeatures = ["vol5Bias", "vol10Bias", "vol20Bias", "vol60Bias"] as const;
const volChangesFeatures = [
  "vol5Change",
  "vol10Change",
  "vol20Change",
  "vol60Change",
] as const;
const volMARatioFeatures = ["volMARatio510", "volMARatio1020", "volMARatio2060"] as const;

const vmIDPrefix = "volume-momentum";

const toggleVolumeFeature = (featureName: string) => {
  toggleElement(getBarGroupID(vmIDPrefix, featureName));
  toggleElement(getLegendID(vmIDPrefix, featureName), 0.3, 1.0);
  toggleElement(getLineID(vmIDPrefix, featureName));
};

const updateIndicator = (StockPrice: StockPrice, feature: VolumeMomentumFeature) => {
  const { duration } = animationConfig;
  const { adjClose, adjOpen } = StockPrice;
  const currFeature = feature;
  const volumeLegend = d3
    .select(`#${getLegendID(vmIDPrefix, "adjVol")}`)
    .transition()
    .duration(duration);
  const volumeColor = adjClose >= adjOpen ? priceColors.up : priceColors.down;
  volumeLegend.select("rect").attr("stroke", volumeColor);
  volumeLegend.select("text").attr("fill", volumeColor);
  [...volBiasFeatures, ...volChangesFeatures].forEach((featureName) => {
    updateTextValue(
      getLegendValueID(vmIDPrefix, featureName),
      digitToPercent(currFeature[featureName]),
    );
  });
  volMARatioFeatures.forEach((featureName) => {
    updateTextValue(
      getLegendValueID(vmIDPrefix, featureName),
      currFeature[featureName].toFixed(2),
    );
  });
};

const updateVolumeIndicators = ({
  prices,
  features,
  xIdx,
}: {
  prices: StockPrice[];
  features: VolumeMomentumFeature[];
  xIdx: number;
}) => {
  updateIndicator(prices[xIdx], features[xIdx]);
};

const resetVolumeIndicators = ({
  prices,
  features,
}: {
  prices: StockPrice[];
  features: VolumeMomentumFeature[];
}) => {
  updateIndicator(prices.at(-1)!, features.at(-1)!);
};

export {
  volBiasFeatures,
  volChangesFeatures,
  volMARatioFeatures,
  vmIDPrefix,
  updateVolumeIndicators,
  toggleVolumeFeature,
  resetVolumeIndicators,
};
