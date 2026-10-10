import type { MACDFeature } from "@/apis";
import Legend from "@/components/ui/Legend";
import { getMACDLegendID, getMACDLegendValueID } from "../interactions/macd";

type NumericFeatureName = {
  [K in keyof MACDFeature]: MACDFeature[K] extends number ? K : never;
}[keyof MACDFeature];

type MACDFeatureIndicatorsProps = {
  features: MACDFeature[];
  featureNames: readonly NumericFeatureName[];
  labels?: string[];
  colors?: string[];
  toggleFn?: (featureName: string) => void;
};

export default function MACDFeatureIndicators({
  features,
  featureNames,
  colors,
  labels,
  toggleFn,
}: MACDFeatureIndicatorsProps) {
  return (
    <g>
      {features.at(-1) &&
        featureNames.map((featureName, i) => {
          return (
            <Legend
              key={getMACDLegendID(featureName)}
              index={i}
              legendId={getMACDLegendID(featureName)}
              valueId={getMACDLegendValueID(featureName)}
              label={labels ? labels[i] : featureName}
              value={features.at(-1)![featureName].toFixed(3)}
              color={colors && colors[i]}
              onMouseDown={() => toggleFn && toggleFn(featureName)}
            />
          );
        })}
    </g>
  );
}
