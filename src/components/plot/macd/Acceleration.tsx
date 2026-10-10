import * as d3 from "d3";

import type { MACDFeature } from "@/apis";
import { colorPalette, plotSizeConfig, priceColors } from "@/components/plot/theme";
import { useTranslation } from "react-i18next";
import {
  getMACDBarGroupID,
  getMACDLineID,
  accelerationFeatures,
  toggleMACDFeature,
} from "@/components/plot/interactions/macd";
import YAxis from "@/components/ui/YAxis";
import type { MACDSubplotProps } from "./shared";
import CrossoverSignals from "./CrossoverSignals";
import MACDFeatureIndicators from "./MACDFeatureIndicators";

export default function Acceleration({ features, width, height, x }: MACDSubplotProps) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  let [yMax, yMin] = [-Infinity, Infinity];
  features.forEach((feature) => {
    accelerationFeatures.forEach((featureName) => {
      yMax = Math.max(yMax, feature[featureName], feature["hist"]);
      yMin = Math.min(yMin, feature[featureName], feature["hist"]);
    });
  });
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );
  const paths: Record<string, string> = {};
  accelerationFeatures.forEach((featureName) => {
    const path = d3
      .line<MACDFeature>()
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
      <CrossoverSignals features={features} x={x} y={y} currPlot="feature" />
      <g id={getMACDBarGroupID("hist")}>
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
          key={getMACDLineID(featureName)}
          id={getMACDLineID(featureName)}
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
