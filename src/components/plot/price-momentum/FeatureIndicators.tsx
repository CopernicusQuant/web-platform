import type { PriceMomentumFeature } from "@/apis";
import { getLegendID, getLegendValueID } from "@plot/interactions/d3-utils";
import { pmIDPrefix } from "@plot/interactions/price-momentum";
import Legend from "@/components/ui/Legend";

type NumericFeatureName = {
  [K in keyof PriceMomentumFeature]: PriceMomentumFeature[K] extends number ? K : never;
}[keyof PriceMomentumFeature];

type FeatureIndicatorsProps = {
  features: PriceMomentumFeature[];
  featureNames: readonly NumericFeatureName[];
  labels?: string[];
  colors?: string[];
  opacities?: number[];
  valueFormatFn?: (value: number) => string;
  toggleFn?: (featureName: string) => void;
};

export default function FeatureIndicators({
  features,
  featureNames,
  labels,
  colors,
  opacities,
  valueFormatFn,
  toggleFn,
}: FeatureIndicatorsProps) {
  return (
    <g>
      {features.at(-1) &&
        featureNames.map((featureName, i) => {
          return (
            <Legend
              key={getLegendID(pmIDPrefix, featureName)}
              legendId={getLegendID(pmIDPrefix, featureName)}
              valueId={getLegendValueID(pmIDPrefix, featureName)}
              index={i}
              label={labels ? labels[i] : featureName}
              value={
                valueFormatFn
                  ? valueFormatFn(features.at(-1)![featureName])
                  : features.at(-1)![featureName].toFixed(2)
              }
              color={colors && colors[i]}
              opacity={opacities && opacities[i]}
              onMouseDown={() => toggleFn && toggleFn(featureName)}
            />
          );
        })}
    </g>
  );
}
