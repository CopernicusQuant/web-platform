import { useTranslation } from "react-i18next";
import Legend from "@/components/ui/Legend";
import { colorPalette, legendConfig, priceColors } from "@plot/theme";
import type { DEMAFeature } from "@/apis";
import type { PriceChartType } from "@/components/shared";
import { useAtomValue } from "jotai";
import { demaPeriodAtom } from "@/atoms/plot";
import {
  demaIDPrefix,
  getDEMAFeatureNamesByPeriod,
  toggleDEMAFeature,
} from "@plot/interactions/dema";
import {
  getCircleID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
} from "@plot/interactions/d3-utils";

type DEMAIndicatorsProps = {
  features: DEMAFeature[];
  chartType: PriceChartType;
};

export default function DEMAIndicators({ features, chartType }: DEMAIndicatorsProps) {
  const { t } = useTranslation();
  const demaPeriod = useAtomValue(demaPeriodAtom);
  const featureNames = getDEMAFeatureNamesByPeriod(demaPeriod);
  const slowFastFeatureNames = featureNames.filter(
    (featureName) => featureName.endsWith("fast") || featureName.endsWith("slow"),
  );
  const { featureWidthTighter, featureGap } = legendConfig;
  return (
    <>
      {/* DEMA circles */}
      <g id={getCirclesGroupID(demaIDPrefix)} opacity={chartType === "line" ? 1 : 0}>
        {slowFastFeatureNames.map((featureName, i) => (
          <circle
            key={getCircleID(demaIDPrefix, featureName)}
            id={getCircleID(demaIDPrefix, featureName)}
            r={5}
            fill={colorPalette[i]}
            stroke="white"
            strokeWidth={2}
            opacity={0}
          />
        ))}
      </g>

      {/* DEMA Gold and Dead crosses */}
      <Legend
        legendId={getLegendID(demaIDPrefix, "gold")}
        valueId={getLegendValueID(demaIDPrefix, "gold")}
        index={0}
        value={""}
        label={"Gold"}
        color={priceColors.up}
        onMouseDown={() => toggleDEMAFeature("gold")}
        size="tighter"
      />
      <Legend
        legendId={getLegendID(demaIDPrefix, "dead")}
        valueId={getLegendValueID(demaIDPrefix, "dead")}
        index={1}
        value={""}
        label={"Dead"}
        color={priceColors.down}
        onMouseDown={() => toggleDEMAFeature("dead")}
        size="tighter"
      />
      {/* Fast Slow lines */}
      <g transform={`translate(${(featureWidthTighter + featureGap) * 2} 0)`}>
        {slowFastFeatureNames.map((featureName, i) => (
          <Legend
            key={getLegendID(demaIDPrefix, featureName)}
            legendId={getLegendID(demaIDPrefix, featureName)}
            valueId={getLegendValueID(demaIDPrefix, featureName)}
            index={i}
            label={t(
              `featureName.${featureName.endsWith("slow") ? "demaSlow" : "demaFast"}`,
            )}
            value={features.at(-1)![featureName].toFixed(2)}
            onMouseDown={() => toggleDEMAFeature(featureName)}
          />
        ))}
      </g>
    </>
  );
}
