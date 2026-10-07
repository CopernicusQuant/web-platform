import type { MarketActivityFeature } from "@/apis/stock";
import Legend from "@/components/ui/Legend";
import { legendConfig } from "@/components/plot/theme";
import {
  getMarketLegendID,
  getMarketLegendValueID,
} from "@/components/plot/interactions/market-activity";

type NumericFeatureName = {
  [K in keyof MarketActivityFeature]: MarketActivityFeature[K] extends number ? K : never;
}[keyof MarketActivityFeature];

type MarketFeatureIndicatorsProps = {
  features: MarketActivityFeature[];
  featureNames: readonly NumericFeatureName[];
  labels?: string[];
  valueFormatFn?: (value: number) => string;
  colors?: string[];
  opacities?: number[];
  wider?: boolean;
};

export default function MarketFeatureIndicators({
  features,
  featureNames,
  labels,
  valueFormatFn,
  colors,
  opacities,
  wider,
}: MarketFeatureIndicatorsProps) {
  const { fontSize, top } = legendConfig;
  return (
    <g transform={`translate(0 ${top})`} fontSize={fontSize}>
      {features.at(-1) &&
        featureNames.map((featureName, i) => {
          return (
            <Legend
              key={getMarketLegendID(featureName)}
              legendId={getMarketLegendID(featureName)}
              valueId={getMarketLegendValueID(featureName)}
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
            />
          );
        })}
    </g>
  );
}
