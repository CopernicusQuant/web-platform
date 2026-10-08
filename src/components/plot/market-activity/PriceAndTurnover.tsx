import * as d3 from "d3";
import { colorPalette, plotSizeConfig } from "@/components/plot/theme";
import {
  getMarketCircleGroupID,
  priceAndTurnoverFeatures,
} from "@/components/plot/interactions/market-activity";
import YAxis from "@/components/plot/YAxis";
import MarketFeatureIndicators from "@/components/plot/market-activity/MarketFeatureIndicators";
import { toggleFeature } from "@/components/plot/interactions/market-activity";
import { useTranslation } from "react-i18next";
import type { MarketSubplotProps } from "./shares";

export default function PriceAndTurnover({
  features,
  x,
  width,
  height,
}: MarketSubplotProps) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { t } = useTranslation();
  const y = d3.scaleLinear([-0.05, 1.05], [height - marginBottom, marginTop]);
  return (
    <>
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      {/* typical range indicator */}
      <g opacity={0.4}>
        <line
          x1={marginLeft}
          x2={width - marginRight}
          y1={y(0.8)}
          y2={y(0.8)}
          stroke="black"
          strokeWidth={1.4}
          strokeDasharray={"6 4"}
        />
        <line
          x1={marginLeft}
          x2={width - marginRight}
          y1={y(0.2)}
          y2={y(0.2)}
          stroke="black"
          strokeWidth={1.4}
          strokeDasharray={"6 4"}
        />
        <rect
          x={x.range()[0]}
          y={y(0.8)}
          width={x.range()[1] - x.range()[0]}
          height={y(0.2) - y(0.8)}
          fill={colorPalette[3]}
          opacity={0.6}
        />
      </g>
      {priceAndTurnoverFeatures.map((featureName, i) => (
        <g
          key={getMarketCircleGroupID(featureName)}
          id={getMarketCircleGroupID(featureName)}
        >
          {features.map((feature) => (
            <circle
              key={`${getMarketCircleGroupID(featureName)}-${feature.tradeDate}`}
              cx={(x(feature.tradeDate) ?? 0) + x.bandwidth() / 2}
              cy={y(feature[featureName])}
              r={3}
              fill={featureName === "amplitudeQuantile" ? "transparent" : colorPalette[i]}
              stroke={
                featureName === "amplitudeQuantile" ? colorPalette[i] : "transparent"
              }
              strokeWidth={2}
            />
          ))}
        </g>
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
