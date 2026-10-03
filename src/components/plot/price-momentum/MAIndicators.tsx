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
import { legendConfig } from "@/components/plot/theme";

type MAIndicatorsProps = {
  features: FeatureByGroup["priceMomentum"][];
  chartType: PriceChartType;
};

export default function MAIndicators({ features, chartType }: MAIndicatorsProps) {
  const getTranslateX = (i: number) => {
    return (
      legendConfig.featureWidth * i +
      legendConfig.featureWidth / 2 +
      legendConfig.featureGap * i
    );
  };
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
        transform={`translate(0 ${legendConfig.top})`}
        fontSize={legendConfig.valueFontSize}
      >
        {features.at(-1) &&
          maFeatures.map((featureName, i) => {
            return (
              <g
                key={getPMLegendId(featureName)}
                id={getPMLegendId(featureName)}
                // make the legend 5 - 20 - 60
                transform={`translate(${getTranslateX(i)} 0)`}
                className="group hover:cursor-pointer"
                onMouseDown={() => toggleMALine(featureName)}
              >
                <rect
                  x={-legendConfig.featureWidth / 2}
                  width={legendConfig.featureWidth}
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
