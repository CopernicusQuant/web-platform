import Legend from "@/components/ui/Legend";
import {
  emaFeatures,
  getMACDCircleID,
  getMACDCirclesGroupID,
  getMACDLegendID,
  getMACDLegendValueID,
  toggleMACDFeature,
} from "../interactions/macd";
import { colorPalette, legendConfig, priceColors } from "../theme";
import type { MACDFeature } from "@/apis";
import { useTranslation } from "react-i18next";
import type { PriceChartType } from "@/atoms/stocks";

type MACDIndicatorsProps = {
  features: MACDFeature[];
  chartType: PriceChartType;
};

export default function MACDIndicators({ features, chartType }: MACDIndicatorsProps) {
  const { t } = useTranslation();
  const { featureWidthTighter, featureGap } = legendConfig;
  return (
    <>
      {/* EMA circles */}
      {chartType === "line" && (
        <g id={getMACDCirclesGroupID()} opacity={0}>
          {emaFeatures.map((featureName, i) => (
            <circle
              key={getMACDCircleID(featureName)}
              id={getMACDCircleID(featureName)}
              r={5}
              fill={colorPalette[i]}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </g>
      )}

      {/* MACD Gold and Dead crosses */}
      <Legend
        legendId={getMACDLegendID("gold")}
        valueId={getMACDLegendValueID("gold")}
        index={0}
        value={""}
        label={"Gold"}
        color={priceColors.up}
        onMouseDown={() => toggleMACDFeature("gold")}
        size="tighter"
      />
      <Legend
        legendId={getMACDLegendID("dead")}
        valueId={getMACDLegendValueID("dead")}
        index={1}
        value={""}
        label={"Dead"}
        color={priceColors.down}
        onMouseDown={() => toggleMACDFeature("dead")}
        size="tighter"
      />
      {/* EMA lines */}
      <g transform={`translate(${(featureWidthTighter + featureGap) * 2} 0)`}>
        {emaFeatures.map((featureName, i) => (
          <Legend
            key={getMACDLegendID(featureName)}
            legendId={getMACDLegendID(featureName)}
            valueId={getMACDLegendValueID(featureName)}
            index={i}
            label={t(`featureName.${featureName}`)}
            value={features.at(-1)![featureName].toFixed(2)}
            onMouseDown={() => toggleMACDFeature(featureName)}
            size="wider"
          />
        ))}
      </g>
    </>
  );
}
