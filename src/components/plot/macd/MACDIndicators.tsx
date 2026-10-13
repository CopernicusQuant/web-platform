import { useTranslation } from "react-i18next";
import Legend from "@/components/ui/Legend";
import { getCircleID, getLegendID, getLegendValueID } from "@plot/interactions/d3-utils";
import { emaFeatures, macdIDPrefix, toggleMACDFeature } from "@plot/interactions/macd";
import { colorPalette, legendConfig, priceColors } from "@plot/theme";
import type { MACDFeature } from "@/apis";
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
      <g opacity={chartType === "line" ? 1 : 0}>
        {emaFeatures.map((featureName, i) => (
          <circle
            key={getCircleID(macdIDPrefix, featureName)}
            id={getCircleID(macdIDPrefix, featureName)}
            r={5}
            fill={colorPalette[i]}
            stroke="white"
            strokeWidth={2}
            opacity={0}
          />
        ))}
      </g>

      {/* MACD Gold and Dead crosses */}
      <Legend
        legendId={getLegendID(macdIDPrefix, "gold")}
        valueId={getLegendValueID(macdIDPrefix, "gold")}
        index={0}
        value={""}
        label={"Gold"}
        color={priceColors.up}
        onMouseDown={() => toggleMACDFeature("gold")}
        size="tighter"
      />
      <Legend
        legendId={getLegendID(macdIDPrefix, "dead")}
        valueId={getLegendValueID(macdIDPrefix, "dead")}
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
            key={getLegendID(macdIDPrefix, featureName)}
            legendId={getLegendID(macdIDPrefix, featureName)}
            valueId={getLegendValueID(macdIDPrefix, featureName)}
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
