import * as d3 from "d3";
import type { PriceMomentumFeature } from "@/apis/stock";
import {
  getPMLineId,
  maColors,
  upDayRatioFeatures,
} from "@/components/plot/interactions/price-momentum";
import YAxis from "@/components/plot/YAxis";
import { plotSizeConfig } from "@/components/plot/theme";

type UpDayRatioProps = {
  features: PriceMomentumFeature[];
  width: number;
  x: d3.ScaleBand<string>;
};

export default function UpDayRatio({ features, width, x }: UpDayRatioProps) {
  const {
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    featurePlotHeight: height,
  } = plotSizeConfig;

  const yPadding = 0.05;
  const y = d3.scaleLinear(
    [0.0 - yPadding, 1.0 + yPadding],
    [height - marginBottom, marginTop],
  );
  const paths: Record<string, string> = {};
  upDayRatioFeatures.forEach((featureName) => {
    const path = d3
      .line<PriceMomentumFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
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
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={maColors[i]}
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
    </>
  );
}
