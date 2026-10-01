import * as d3 from "d3";
import type { FeatureByGroup } from "@/apis/stock";
import YAxis from "@/components/plot/YAxis";
import {
  maBiasFeatures,
  maColors,
  getPMLineId,
} from "@/components/plot/interactions/price-momentum";
import { plotSizeConfig } from "../theme";

type PriceMomentumFeature = FeatureByGroup["priceMomentum"];

type MABiasProps = {
  features: PriceMomentumFeature[];
  width: number;
  x: d3.ScaleBand<string>;
};

export default function MABias({ features, width, x }: MABiasProps) {
  const {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    featurePlotHeight: height,
  } = plotSizeConfig;
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

  // create value paths
  const paths: Record<string, string> = {};
  maBiasFeatures.forEach((featrueName) => {
    const path = d3
      .line<PriceMomentumFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featrueName]))(features);
    if (path !== null) paths[featrueName] = path;
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
          stroke={maColors[i]}
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
    </>
  );
}
