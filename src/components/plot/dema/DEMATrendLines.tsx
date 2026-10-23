import * as d3 from "d3";
import type { DEMAFeature } from "@/apis";
import { demaPeriodAtom } from "@/atoms/plot";
import type { PriceChartType } from "@/components/shared";
import { demaIDPrefix, getDEMAFeatureNamesByPeriod } from "@plot/interactions/dema";
import { useAtomValue } from "jotai";
import { colorPalette, svgConfig } from "@plot/theme";
import { getLineID, getPaths } from "@plot/interactions/d3-utils";

type DEMATrendLinesProps = {
  features: DEMAFeature[];
  chartType: PriceChartType;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function DEMATrendLines({
  features,
  // chartType,
  x,
  y,
}: DEMATrendLinesProps) {
  const { strokeWidth, opacity } = svgConfig;
  const demaPeriod = useAtomValue(demaPeriodAtom);
  const featureNames = getDEMAFeatureNamesByPeriod(demaPeriod);
  const emaFeatureNames = featureNames.filter(
    (name) => name.endsWith("fast") || name.endsWith("slow"),
  );

  const goldDays: string[] = [];
  const deadDays: string[] = [];
  features.forEach((feature) => {
    const goldCrossName = featureNames.filter((name) => name.endsWith("gold"))[0];
    const deadCrossName = featureNames.filter((name) => name.endsWith("dead"))[0];
    if (feature[goldCrossName] === 1) goldDays.push(feature.tradeDate);
    if (feature[deadCrossName] === 1) deadDays.push(feature.tradeDate);
  });
  const paths = getPaths<"dema">(features, emaFeatureNames, x, y);
  return (
    <>
      <g>
        {Object.entries(paths).map(([featureName, d], i) => (
          <path
            key={getLineID(demaIDPrefix, featureName)}
            id={getLineID(demaIDPrefix, featureName)}
            d={d}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        ))}
      </g>
    </>
  );
}
