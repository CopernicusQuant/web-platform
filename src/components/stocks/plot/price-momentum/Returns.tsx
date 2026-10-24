import { digitToPercent } from "@/lib/utils";
import {
  pmIDPrefix,
  returnFeatures,
  toggleFeature,
} from "@stocks/plot/interactions/price-momentum";
import { plotSizeConfig, priceColors } from "@/lib/theme";
import YAxis from "@/components/ui/YAxis";
import FeatureIndicators from "@stocks/plot/price-momentum/FeatureIndicators";
import type { SubplotProps } from "@/components/stocks/shared";
import {
  getBarGroupID,
  getFeatureValues,
  getYScale,
} from "@stocks/plot/interactions/d3-utils";

export default function Returns({
  features,
  x,
  width,
  height,
}: SubplotProps<"pricemomentum">) {
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;

  const values = getFeatureValues<"pricemomentum">(features, returnFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const legendLabels = returnFeatures.map(
    (featureName) => `${featureName.match(/\d+/)}D`,
  );
  const initialColors = returnFeatures.map((featureName) =>
    features.at(-1)![featureName] >= 0 ? priceColors.up : priceColors.down,
  );
  const opacities = [1.0, 0.6, 0.4];

  return (
    <g>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPostfix="%"
        labelFormatter={(value: number) => (value * 100).toFixed(1)}
      />
      {returnFeatures.map((featureName, i) => {
        return (
          <g
            key={getBarGroupID(pmIDPrefix, featureName)}
            id={getBarGroupID(pmIDPrefix, featureName)}
          >
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
