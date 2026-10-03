import type { PriceMomentumFeature } from "@/apis/stock";
import { legendConfig } from "@/components/plot/theme";
import {
  getPMLegendId,
  getPMLegendValueId,
  maColors,
} from "@/components/plot/interactions/price-momentum";

type NumericFeatureName = {
  [K in keyof PriceMomentumFeature]: PriceMomentumFeature[K] extends number ? K : never;
}[keyof PriceMomentumFeature];

type FeatureIndicatorsProps = {
  features: PriceMomentumFeature[];
  featureNames: readonly NumericFeatureName[];
  labels?: string[];
  valueFormatFn?: (value: number) => string;
  colors?: string[];
  opacities?: number[];
};

export default function FeatureIndicators({
  features,
  featureNames,
  valueFormatFn,
  labels,
  colors,
  opacities,
}: FeatureIndicatorsProps) {
  const legendColors = colors ?? maColors;
  const getTranslateX = (i: number) => {
    return (
      legendConfig.featureWidth * i +
      legendConfig.featureWidth / 2 +
      legendConfig.featureGap * i
    );
  };
  return (
    <g
      transform={`translate(0 ${legendConfig.top})`}
      fontSize={legendConfig.valueFontSize}
    >
      {features.at(-1) &&
        featureNames.map((featureName, i) => {
          return (
            <g
              key={getPMLegendId(featureName)}
              id={getPMLegendId(featureName)}
              transform={`translate(${getTranslateX(i)} 0)`}
            >
              <rect
                x={-legendConfig.featureWidth / 2}
                width={legendConfig.featureWidth}
                height={22}
                rx={4}
                fill="transparent"
                stroke={legendColors[i]}
                opacity={opacities ? opacities[i] : 1}
              />
              <text
                y={legendConfig.lineHeight}
                textAnchor="middle"
                fill={legendColors[i]}
              >
                <tspan fontWeight={"700"}>{labels ? labels[i] : featureName}</tspan>
                <tspan dx={4} id={getPMLegendValueId(featureName)}>
                  {valueFormatFn
                    ? valueFormatFn(features.at(-1)![featureName])
                    : features.at(-1)![featureName]}
                </tspan>
              </text>
            </g>
          );
        })}
    </g>
  );
}
