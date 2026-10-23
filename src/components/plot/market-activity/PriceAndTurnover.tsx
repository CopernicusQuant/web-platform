import * as d3 from "d3";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import { useTranslation } from "react-i18next";
import YAxis from "@/components/ui/YAxis";
import { priceAndTurnoverFeatures } from "@plot/interactions/market-activity";
import MarketFeatureIndicators from "@plot/market-activity/MarketFeatureIndicators";
import type { SubplotProps } from "@/components/shared";
import { toggleFeature } from "@plot/interactions/market-activity";
import { getCirclesGroupID } from "@plot/interactions/d3-utils";

export default function PriceAndTurnover({
  features,
  x,
  width,
  height,
}: SubplotProps<"marketActivity">) {
  const { shadeOpacity } = svgConfig;
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { t } = useTranslation();
  const y = d3.scaleLinear([-0.05, 1.05], [height - marginBottom, marginTop]);
  return (
    <>
      <YAxis
        y={y}
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
          strokeWidth={svgConfig.markStrokeWidth}
          strokeDasharray={svgConfig.markStrokeDasharray}
        />
        <line
          x1={marginLeft}
          x2={width - marginRight}
          y1={y(0.2)}
          y2={y(0.2)}
          stroke="black"
          strokeWidth={svgConfig.markStrokeWidth}
          strokeDasharray={svgConfig.markStrokeDasharray}
        />
        <rect
          x={x.range()[0]}
          y={y(0.8)}
          width={x.range()[1] - x.range()[0]}
          height={y(0.2) - y(0.8)}
          fill={colorPalette[3]}
          opacity={shadeOpacity + 0.1}
        />
      </g>
      {priceAndTurnoverFeatures.map((featureName, i) => (
        <g key={getCirclesGroupID(featureName)} id={getCirclesGroupID(featureName)}>
          {features.map((feature) => (
            <circle
              key={`${getCirclesGroupID(featureName)}-${feature.tradeDate}`}
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
        wide={true}
        toggleFn={toggleFeature}
      />
    </>
  );
}
