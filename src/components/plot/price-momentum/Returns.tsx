import { digitToPercent } from "@/lib/utils";
import {
  pmIDPrefix,
  returnFeatures,
  toggleFeature,
} from "@plot/interactions/price-momentum";
import { plotSizeConfig, priceColors } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import FeatureIndicators from "@plot/price-momentum/FeatureIndicators";
import type { SubplotProps } from "@/components/shared";
import { getBarGroupID, getFeatureValues, getYScale } from "@plot/interactions/d3-utils";

export default function Returns({
  features,
  x,
  width,
  height,
}: SubplotProps<"priceMomentum">) {
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;

  const values = getFeatureValues<"priceMomentum">(features, returnFeatures);
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
