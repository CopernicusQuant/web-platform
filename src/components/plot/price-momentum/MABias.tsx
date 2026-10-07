import * as d3 from "d3";
import type { FeatureByGroup } from "@/apis/stock";
import YAxis from "@/components/plot/YAxis";
import {
  maBiasFeatures,
  getPMLineId,
} from "@/components/plot/interactions/price-momentum";
import { colorPalette, plotSizeConfig } from "@/components/plot/theme";
import FeatureIndicators from "@/components/plot/price-momentum/FeatureIndicators";
import { digitToPercent } from "@/lib/utils";

type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

type MABiasProps = {
  features: PriceMomentumFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export default function MABias({ features, width, height, x }: MABiasProps) {
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;
  // y-axis mapper
  let yMin = 1.0;
  let yMax = -1.0;
  features.forEach((feature) => {
    maBiasFeatures.forEach((featureName) => {
      yMin = Math.min(yMin, feature[featureName]);
      yMax = Math.max(yMax, feature[featureName]);
    });
  });
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );

  const paths: Record<string, string> = {};
  const legendLabels: string[] = [];
  maBiasFeatures.forEach((featureName) => {
    // create path
    const path = d3
      .line<PriceMomentumFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
    else return;
    // create label
    const daysLabel = featureName.match(/\d+/);
    if (!daysLabel) legendLabels.push(featureName);
    else legendLabels.push(`${daysLabel}D`);
  });

  return (
    <>
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPostfix="%"
        labelFormatter={(value: number) => (value * 100).toFixed(1)}
      />
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={`${getPMLineId(featureName)}`}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i]}
        />
      ))}
      {/* 0% indicator */}
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(0.0)}
        y2={y(0.0)}
        stroke="black"
        strokeWidth={1.4}
        strokeDasharray={"6 4"}
      />
      <FeatureIndicators
        featureNames={maBiasFeatures}
        features={features}
        valueFormatFn={digitToPercent}
        labels={legendLabels}
      />
    </>
  );
}
