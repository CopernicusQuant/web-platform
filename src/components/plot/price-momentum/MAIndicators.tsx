import type { FeatureByGroup } from "@/apis/stock";
import type { PriceChartType } from "@/atoms/stocks";
import {
  getPMCircleId,
  maCircleGroupID,
  maFeatures,
  toggleFeature,
  getPMLegendId,
  getPMLegendValueId,
} from "@/components/plot/interactions/price-momentum";
import { colorPalette } from "@/components/plot/theme";
import Legend from "@/components/ui/Legend";

type MAIndicatorsProps = {
  features: FeatureByGroup["priceMomentum"][];
  chartType: PriceChartType;
};

export default function MAIndicators({ features, chartType }: MAIndicatorsProps) {
  return (
    <>
      {/* Moving average lines */}
      {chartType === "line" && (
        <g id={maCircleGroupID} opacity={0}>
          {maFeatures.map((featureName, i) => (
            <circle
              key={getPMCircleId(featureName)}
              id={getPMCircleId(featureName)}
              r={5}
              fill={colorPalette[i]}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </g>
      )}
      {/* Moving average legends */}
      <g>
        {features.at(-1) &&
          maFeatures.map((featureName, i) => {
            return (
              <Legend
                key={getPMLegendId(featureName)}
                legendId={getPMLegendId(featureName)}
                valueId={getPMLegendValueId(featureName)}
                index={i}
                value={features.at(-1)![featureName].toFixed(2)}
                label={featureName.toUpperCase()}
                onMouseDown={() => toggleFeature(featureName)}
              />
            );
          })}
      </g>
    </>
  );
}
