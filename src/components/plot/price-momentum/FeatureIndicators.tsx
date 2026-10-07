import type { PriceMomentumFeature } from "@/apis/stock";
import { legendConfig } from "@/components/plot/theme";
import {
  getPMLegendId,
  getPMLegendValueId,
} from "@/components/plot/interactions/price-momentum";
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
  wider?: boolean;
  valueFormatFn?: (value: number) => string;
  toggleFn?: (featureName: string) => void;
};

export default function FeatureIndicators({
  features,
  featureNames,
  labels,
  colors,
  opacities,
  wider,
  valueFormatFn,
  toggleFn,
}: FeatureIndicatorsProps) {
  return (
    <g transform={`translate(0 ${legendConfig.top})`} fontSize={legendConfig.fontSize}>
      {features.at(-1) &&
        featureNames.map((featureName, i) => {
          return (
            <Legend
              key={getPMLegendId(featureName)}
              legendId={getPMLegendId(featureName)}
              valueId={getPMLegendValueId(featureName)}
              index={i}
              label={labels ? labels[i] : featureName}
              value={
                valueFormatFn
                  ? valueFormatFn(features.at(-1)![featureName])
                  : features.at(-1)![featureName].toFixed(2)
              }
              color={colors && colors[i]}
              opacity={opacities && opacities[i]}
              wider={wider}
              onMouseDown={() => toggleFn && toggleFn(featureName)}
            />
          );
        })}
    </g>
  );
}
