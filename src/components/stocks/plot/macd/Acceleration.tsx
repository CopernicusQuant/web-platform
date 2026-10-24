import { colorPalette, plotSizeConfig, priceColors } from "@/lib/theme";
import { useTranslation } from "react-i18next";
import {
  accelerationFeatures,
  macdIDPrefix,
  toggleMACDFeature,
} from "@stocks/plot/interactions/macd";
import YAxis from "@/components/ui/YAxis";
import type { SubplotProps } from "@/components/stocks/shared";
import CrossoverSignals from "./CrossoverSignals";
import MACDFeatureIndicators from "./MACDFeatureIndicators";
import {
  getBarGroupID,
  getFeatureValues,
  getLineID,
  getPaths,
  getYScale,
} from "@stocks/plot/interactions/d3-utils";

export default function Acceleration({
  features,
  width,
  height,
  x,
}: SubplotProps<"macd">) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const values = getFeatureValues<"macd">(features, [...accelerationFeatures, "hist"]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"macd">(features, accelerationFeatures, x, y);

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      <CrossoverSignals features={features} x={x} y={y} currPlot="feature" />
      <g id={getBarGroupID(macdIDPrefix, "hist")}>
        {features.map((feature) => (
          <rect
            key={`macd-hist-${feature.tradeDate}`}
            x={x(feature.tradeDate)}
            y={feature.hist >= 0 ? y(feature.hist) : y(0)}
            width={x.bandwidth()}
            height={Math.abs(y(0) - y(feature.hist))}
            fill={feature.hist >= 0 ? priceColors.up : priceColors.down}
            opacity={0.6}
          />
        ))}
      </g>
      {Object.entries(paths).map(([featureName, d], i) => (
        <path
          key={getLineID(macdIDPrefix, featureName)}
          id={getLineID(macdIDPrefix, featureName)}
          d={d}
          fill="none"
          stroke={colorPalette[i]}
          strokeWidth={1.5}
        />
      ))}
      <MACDFeatureIndicators
        features={features}
        featureNames={[...accelerationFeatures, "hist"]}
        labels={[...accelerationFeatures, "hist"].map((featureName) =>
          t(`featureName.${featureName}`),
        )}
        colors={[
          colorPalette[0],
          colorPalette[1],
          features.at(-1)!.hist >= 0 ? priceColors.up : priceColors.down,
        ]}
        toggleFn={toggleMACDFeature}
      />
    </>
  );
}
