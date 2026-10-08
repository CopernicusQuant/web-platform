import * as d3 from "d3";
import { colorPalette, plotSizeConfig } from "../theme";
import type { MarketActivityFeature } from "@/apis/stock";
import {
  getMarketLineID,
  priceAndTurnoverFeatures,
} from "@/components/plot/interactions/market-activity";
import YAxis from "@/components/plot/YAxis";
import MarketFeatureIndicators from "@/components/plot/market-activity/MarketFeatureIndicators";
import { toggleFeature } from "@/components/plot/interactions/market-activity";
import { useTranslation } from "react-i18next";

type PriceAndTurnoverProps = {
  features: MarketActivityFeature[];
  x: d3.ScaleBand<string>;
  width: number;
  height: number;
};

export default function PriceAndTurnover({
  features,
  x,
  width,
  height,
}: PriceAndTurnoverProps) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { t } = useTranslation();
  const y = d3.scaleLinear([-0.05, 1.05], [height - marginBottom, marginTop]);
  const paths: Record<string, string> = {};
  priceAndTurnoverFeatures.forEach((featureName) => {
    const path = d3
      .line<MarketActivityFeature>()
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
      />
      {Object.entries(paths).map(([key, value], i) => (
        <path
          key={getMarketLineID(key)}
          id={getMarketLineID(key)}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i]}
        />
      ))}
      <MarketFeatureIndicators
        featureNames={priceAndTurnoverFeatures}
        features={features}
        labels={priceAndTurnoverFeatures.map((featureName) =>
          t(`featureName.${featureName}`),
        )}
        wider={true}
        toggleFn={toggleFeature}
      />
    </>
  );
}
