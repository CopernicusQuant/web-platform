import type { FeatureByGroup } from "@/apis/stock";
import type { PriceChartType } from "@/atoms/stocks";
import {
  getPMCircleId,
  maCircleGroupID,
  maFeatures,
  maColors,
  toggleMALine,
  getPMLegendId,
} from "@/components/plot/interactions/price-momentum";
import { priceTrendConfig } from "../theme";

type MAIndicatorsProps = {
  features: FeatureByGroup["priceMomentum"][];
  chartType: PriceChartType;
  width: number;
};

const visConfig = {
  legendWidth: 52,
  width: 72,
};

export default function MAIndicators({ features, chartType, width }: MAIndicatorsProps) {
  return (
    <>
      {chartType === "line" && (
        <g id={maCircleGroupID} opacity={0}>
          {maFeatures.map((featureName, i) => (
            <circle
              key={getPMCircleId(featureName)}
              id={getPMCircleId(featureName)}
              r={5}
              fill={maColors[i]}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </g>
      )}
      <g
        transform={`translate(${width - visConfig.legendWidth / 2} ${priceTrendConfig.top})`}
        fontSize={13}
      >
        {features.at(-1) &&
          maFeatures.map((featureName, i) => {
            return (
              <g
                key={`temp-${featureName}`}
                id={getPMLegendId(featureName)}
                transform={`translate(${-visConfig.legendWidth * i - 10 * i} 0)`}
                className="group"
                onMouseDown={() => toggleMALine(featureName)}
              >
                <rect
                  x={-visConfig.legendWidth / 2}
                  width={visConfig.legendWidth}
                  height={22}
                  rx={4}
                  fill={maColors[i]}
                  className="group-hover:cursor-pointer"
                />
                <text
                  y={priceTrendConfig.lineHeight}
                  textAnchor="middle"
                  fill="white"
                  className="group-hover:cursor-pointer"
                >
                  <tspan>{featureName.toUpperCase()}</tspan>
                </text>
              </g>
            );
          })}
      </g>
    </>
  );
}
