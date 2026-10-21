import * as d3 from "d3";
import { useTranslation } from "react-i18next";
import type { KDJFeature } from "@/apis";
import {
  kdjIDPrefix,
  kdjLowHighFeatures,
  toggleKDJElement,
} from "@plot/interactions/kdj";
import {
  getCircleID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
} from "@plot/interactions/d3-utils";
import { colorPalette, svgConfig } from "@plot/theme";
import Legend from "@/components/ui/Legend";
import type { PriceChartType } from "@/atoms/stocks";

type KDJLowHighProps = {
  features: KDJFeature[];
  chartType: PriceChartType;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function KDJLowHigh({ features, chartType, x, y }: KDJLowHighProps) {
  const { t } = useTranslation();
  const { strokeWidth, strokeDasharray, circleR, circleStroke } = svgConfig;
  const paths = getPaths<"kdj">(features, kdjLowHighFeatures, x, y);
  const lastFeature = features.at(-1)!;
  return (
    <>
      {kdjLowHighFeatures.map((featureName, i) => (
        <g key={getLineID(kdjIDPrefix, featureName)}>
          <path
            id={getLineID(kdjIDPrefix, featureName)}
            d={paths[featureName]}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
          <Legend
            legendId={getLegendID(kdjIDPrefix, featureName)}
            valueId={getLegendValueID(kdjIDPrefix, featureName)}
            color={colorPalette[i]}
            index={i}
            label={t(`featureName.${featureName}`)}
            value={features.at(-1)![featureName].toFixed(2)}
            size="wider"
            onMouseDown={() => toggleKDJElement(featureName)}
          />
        </g>
      ))}
      <g id={getCirclesGroupID(kdjIDPrefix)} opacity={chartType === "line" ? 1 : 0}>
        {kdjLowHighFeatures.map((featureName, i) => (
          <circle
            key={getCircleID(kdjIDPrefix, featureName)}
            id={getCircleID(kdjIDPrefix, featureName)}
            cx={(x(lastFeature?.tradeDate) ?? 0) + x.bandwidth() / 2}
            cy={y(lastFeature[featureName])}
            fill={colorPalette[i]}
            r={circleR}
            stroke={"white"}
            strokeWidth={circleStroke}
            opacity={0}
          />
        ))}
      </g>
    </>
  );
}
