import type { FeatureByGroup } from "@/apis";
import type { PriceChartType } from "@/components/stocks/shared";
import {
  maFeatures,
  pmIDPrefix,
  toggleFeature,
} from "@stocks/plot/interactions/price-momentum";
import { colorPalette } from "@/lib/theme";
import Legend from "@/components/ui/Legend";
import {
  getCirclesGroupID,
  getCircleID,
  getLegendID,
  getLegendValueID,
} from "@stocks/plot/interactions/d3-utils";

type MAIndicatorsProps = {
  features: FeatureByGroup["pricemomentum"][];
  chartType: PriceChartType;
};

export default function MAIndicators({ features, chartType }: MAIndicatorsProps) {
  return (
    <>
      {/* Moving average lines */}
      <g id={getCirclesGroupID(pmIDPrefix)} opacity={chartType === "line" ? 1 : 0}>
        {maFeatures.map((featureName, i) => (
          <circle
            key={getCircleID(pmIDPrefix, featureName)}
            id={getCircleID(pmIDPrefix, featureName)}
            r={5}
            fill={colorPalette[i]}
            stroke="white"
            strokeWidth={2}
            opacity={0}
          />
        ))}
      </g>
      {/* Moving average legends */}
      {features.at(-1) &&
        maFeatures.map((featureName, i) => {
          return (
            <Legend
              key={getLegendID(pmIDPrefix, featureName)}
              legendId={getLegendID(pmIDPrefix, featureName)}
              valueId={getLegendValueID(pmIDPrefix, featureName)}
              index={i}
              value={features.at(-1)![featureName].toFixed(2)}
              label={featureName.toUpperCase()}
              onMouseDown={() => toggleFeature(featureName)}
            />
          );
        })}
    </>
  );
}
