import * as d3 from "d3";
import type { PriceMomentumFeature } from "@/apis/stock";
import {
  getPMLineId,
  toggleFeature,
  upDayRatioFeatures,
} from "@/components/plot/interactions/price-momentum";
import YAxis from "@/components/plot/YAxis";
import { colorPalette, plotSizeConfig } from "@/components/plot/theme";
import FeatureIndicators from "./FeatureIndicators";
import { digitToPercent } from "@/lib/utils";

type UpDayRatioProps = {
  features: PriceMomentumFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export default function UpDayRatio({ features, width, height, x }: UpDayRatioProps) {
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;

  const yPadding = 0.05;
  const y = d3.scaleLinear(
    [0.0 - yPadding, 1.0 + yPadding],
    [height - marginBottom, marginTop],
  );
  const paths: Record<string, string> = {};
  const legendLabels: string[] = [];
  upDayRatioFeatures.forEach((featureName) => {
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
      {Object.entries(paths).map(([key, value], i) => (
        <path
          key={getPMLineId(key)}
          id={getPMLineId(key)}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i]}
        />
      ))}
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(0.5)}
        y2={y(0.5)}
        stroke="black"
        strokeWidth={1.4}
        strokeDasharray={"6 4"}
      />
      <FeatureIndicators
        featureNames={upDayRatioFeatures}
        features={features}
        valueFormatFn={digitToPercent}
        labels={legendLabels}
        toggleFn={toggleFeature}
      />
    </>
  );
}
