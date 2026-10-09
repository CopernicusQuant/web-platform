import * as d3 from "d3";
import { useMemo } from "react";
import { digitToPercent } from "@/lib/utils";
import {
  getPMBarGroupId,
  returnFeatures,
  toggleFeature,
} from "@/components/plot/interactions/price-momentum";
import { plotSizeConfig, priceColors } from "@/components/plot/theme";
import YAxis from "@/components/ui/YAxis";
import FeatureIndicators from "@/components/plot/price-momentum/FeatureIndicators";
import type { PMSubplotProps } from "./shared";

export default function Returns({ features, x, width, height }: PMSubplotProps) {
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;
  // y-axis mapper
  const [yMin, yMax] = useMemo(() => {
    let yMin = Infinity;
    let yMax = -Infinity;
    features.forEach((feature) => {
      returnFeatures.forEach((featureName) => {
        yMin = Math.min(yMin, feature[featureName]);
        yMax = Math.max(yMax, feature[featureName]);
      });
    });
    const yPadding = (yMax - yMin) * 0.05 || 1;
    return [yMin - yPadding, yMax + yPadding];
  }, [features]);

  const legendLabels = returnFeatures.map(
    (featureName) => `${featureName.match(/\d+/)}D`,
  );
  const initialColors = returnFeatures.map((featureName) =>
    features.at(-1)![featureName] >= 0 ? priceColors.up : priceColors.down,
  );

  const y = d3.scaleLinear([yMin, yMax], [height - marginBottom, marginTop]);
  const opacities = [1.0, 0.6, 0.4];

  return (
    <g>
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPostfix="%"
        labelFormatter={(value: number) => (value * 100).toFixed(1)}
      />
      {returnFeatures.map((featureName, i) => {
        return (
          <g key={getPMBarGroupId(featureName)} id={getPMBarGroupId(featureName)}>
            {features.map((feature) => {
              const val = feature[featureName];
              return (
                <rect
                  key={`pm-${feature.tradeDate}-${featureName}`}
                  x={x(feature.tradeDate)}
                  y={val >= 0 ? y(val) : y(0)}
                  width={x.bandwidth()}
                  height={Math.abs(y(val) - y(0))}
                  opacity={opacities[i]}
                  fill={val >= 0 ? priceColors.up : priceColors.down}
                />
              );
            })}
          </g>
        );
      })}
      <FeatureIndicators
        featureNames={returnFeatures}
        features={features}
        valueFormatFn={digitToPercent}
        labels={legendLabels}
        colors={initialColors}
        opacities={opacities}
        toggleFn={toggleFeature}
      />
    </g>
  );
}
