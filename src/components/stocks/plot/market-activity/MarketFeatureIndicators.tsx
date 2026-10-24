import type { MarketActivityFeature } from "@/apis";
import Legend from "@/components/ui/Legend";
import { getLegendID, getLegendValueID } from "@stocks/plot/interactions/d3-utils";
import { marketIDPrefix } from "@stocks/plot/interactions/market-activity";

type NumericFeatureName = {
  [K in keyof MarketActivityFeature]: MarketActivityFeature[K] extends number ? K : never;
}[keyof MarketActivityFeature];

type MarketFeatureIndicatorsProps = {
  features: MarketActivityFeature[];
  featureNames: readonly NumericFeatureName[];
  labels?: string[];
  colors?: string[];
  opacities?: number[];
  wide?: boolean;
  valueFormatFn?: (value: number) => string;
  toggleFn?: (featureName: string) => void;
};

export default function MarketFeatureIndicators({
  features,
  featureNames,
  labels,
  colors,
  opacities,
  wide,
  valueFormatFn,
  toggleFn,
}: MarketFeatureIndicatorsProps) {
  return (
    <g>
      {features.at(-1) &&
        featureNames.map((featureName, i) => {
          return (
            <Legend
              key={getLegendID(marketIDPrefix, featureName)}
              legendId={getLegendID(marketIDPrefix, featureName)}
              valueId={getLegendValueID(marketIDPrefix, featureName)}
              index={i}
              label={labels ? labels[i] : featureName}
              value={
                valueFormatFn
                  ? valueFormatFn(features.at(-1)![featureName])
                  : features.at(-1)![featureName].toFixed(2)
              }
              color={colors && colors[i]}
              opacity={opacities && opacities[i]}
              size={wide ? "widest" : "base"}
              onMouseDown={() => toggleFn && toggleFn(featureName)}
            />
          );
        })}
    </g>
  );
}
