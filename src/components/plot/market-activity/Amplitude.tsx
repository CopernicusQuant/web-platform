import * as d3 from "d3";
import {
  amplitudeFeatures,
  getMarketBarGroupID,
  getMarketLineID,
} from "../interactions/market-activity";
import type { MarketSubplotProps } from "./shares";
import { colorPalette, plotSizeConfig } from "../theme";
import YAxis from "../YAxis";
import type { MarketActivityFeature } from "@/apis/stock";
import MarketFeatureIndicators from "./MarketFeatureIndicators";
import { toggleFeature } from "../interactions/market-activity";
import { useTranslation } from "react-i18next";

export default function Amplitude({ features, x, width, height }: MarketSubplotProps) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  let [yMax, yMin] = [-Infinity, Infinity];
  features.forEach((feature) => {
    amplitudeFeatures.forEach((featureName) => {
      yMax = Math.max(yMax, feature[featureName]);
      yMin = Math.min(yMin, feature[featureName]);
    });
  });
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );
  const paths: Record<string, string> = {};
  amplitudeFeatures.forEach((featureName) => {
    if (featureName === "amplitude") return;
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
        labelFormatter={(value) => (value * 100).toFixed(1)}
        labelPostfix="%"
      />
      <g id={getMarketBarGroupID("amplitude")}>
        {features.map((feature) => (
          <rect
            key={`market-amplitude-${feature.tradeDate}`}
            x={(x(feature.tradeDate) ?? 0) + x.bandwidth() * 0.1}
            y={y(feature.amplitude)}
            width={x.bandwidth() * 0.8}
            height={y.range()[0] - y(feature.amplitude)}
            fill={colorPalette[0]}
            opacity={0.6}
          />
        ))}
      </g>
      {Object.entries(paths).map(([key, value], i) => (
        <path
          key={getMarketLineID(key)}
          id={getMarketLineID(key)}
          d={value}
          fill="none"
          strokeWidth={1.7}
          stroke={colorPalette[i + 1]}
        />
      ))}
      <MarketFeatureIndicators
        featureNames={amplitudeFeatures}
        features={features}
        labels={amplitudeFeatures.map((featureName) => t(`featureName.${featureName}`))}
        wider={true}
        toggleFn={toggleFeature}
        valueFormatFn={(value) => `${(value * 100).toFixed(1)}%`}
      />
    </>
  );
}
