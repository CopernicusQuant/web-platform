import type { PriceChartType } from "@/atoms/stocks";
import {
  getMACircleId,
  maCircleGroupID,
  maFeatures,
  maColors,
} from "@/components/plot/interactions/price-momentum";

type MAIndicators = {
  chartType: PriceChartType;
};

export default function MAIndicators({ chartType }: MAIndicators) {
  return (
    <>
      {chartType === "line" && (
        <g id={maCircleGroupID} opacity={0}>
          {maFeatures.map((featureName, i) => (
            <circle
              key={getMACircleId(featureName)}
              id={getMACircleId(featureName)}
              cx={0}
              cy={0}
              r={5}
              fill={maColors[i]}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </g>
      )}
    </>
  );
}
