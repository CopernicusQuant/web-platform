import type { FeatureByGroup } from "@/apis/stock";
import type { PriceChartType } from "@/atoms/stocks";
import {
  getPMCircleId,
  maCircleGroupID,
  maFeatures,
  maColors,
  toggleMALine,
  getPMLegendId,
  getPMLegendValueId,
} from "@/components/plot/interactions/price-momentum";
import { legendConfig } from "../theme";

type MAIndicatorsProps = {
  features: FeatureByGroup["priceMomentum"][];
  chartType: PriceChartType;
  width: number;
};

const visConfig = {
  legendWidth: 96,
  gap: 10,
};

export default function MAIndicators({ features, chartType, width }: MAIndicatorsProps) {
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
              fill={maColors[i]}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </g>
      )}
      {/* Moving average legends */}
      <g
        transform={`translate(${width - visConfig.legendWidth / 2} ${legendConfig.top})`}
        fontSize={13}
      >
        {features.at(-1) &&
          maFeatures.map((featureName, i) => {
            return (
              <g
                key={getPMLegendId(featureName)}
                id={getPMLegendId(featureName)}
                // make the legend 5 - 20 - 60
                transform={`translate(${-visConfig.legendWidth * (maFeatures.length - 1 - i) - visConfig.gap * (maFeatures.length - 1 - i)} 0)`}
                className="group hover:cursor-pointer"
                onMouseDown={() => toggleMALine(featureName)}
              >
                <rect
                  x={-visConfig.legendWidth / 2}
                  width={visConfig.legendWidth}
                  height={22}
                  rx={4}
                  fill={"transparent"}
                  stroke={maColors[i]}
                  className="group-hover:cursor-pointer select-none"
                />
                <text
                  y={legendConfig.lineHeight}
                  textAnchor="middle"
                  fill={maColors[i]}
                  className="group-hover:cursor-pointer select-none"
                >
                  <tspan fontWeight={"700"}>{featureName.toUpperCase()}</tspan>
                  <tspan id={getPMLegendValueId(featureName)} dx={4}>
                    {features.at(-1)![featureName].toFixed(2)}
                  </tspan>
                </text>
              </g>
            );
          })}
      </g>
    </>
  );
}
