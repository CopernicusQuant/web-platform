import { useTranslation } from "react-i18next";
import { amplitudeFeatures, marketIDPrefix } from "@plot/interactions/market-activity";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import type { SubplotProps } from "@/components/shared";
import MarketFeatureIndicators from "@plot/market-activity/MarketFeatureIndicators";
import { toggleFeature } from "@plot/interactions/market-activity";
import YAxis from "@/components/ui/YAxis";
import {
  getBarGroupID,
  getFeatureValues,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";

export default function Amplitude({
  features,
  x,
  width,
  height,
}: SubplotProps<"marketactivity">) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const values = getFeatureValues<"marketactivity">(features, amplitudeFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const pathFeatures = amplitudeFeatures.filter(
    (featureName) => featureName !== "amplitude",
  );
  const paths = getPaths<"marketactivity">(features, pathFeatures, x, y);
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value) => (value * 100).toFixed(1)}
        labelPostfix="%"
      />
      <g id={getBarGroupID(marketIDPrefix, "amplitude")}>
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
      {Object.entries(paths).map(([featureName, value], i) => (
        <path
          key={getLineID(marketIDPrefix, featureName)}
          id={getLineID(marketIDPrefix, featureName)}
          d={value}
          fill="none"
          strokeWidth={svgConfig.strokeWidth}
          stroke={colorPalette[i + 1]}
        />
      ))}
      <MarketFeatureIndicators
        featureNames={amplitudeFeatures}
        features={features}
        labels={amplitudeFeatures.map((featureName) => t(`featureName.${featureName}`))}
        wide={true}
        toggleFn={toggleFeature}
        valueFormatFn={(value) => `${(value * 100).toFixed(1)}%`}
      />
    </>
  );
}
