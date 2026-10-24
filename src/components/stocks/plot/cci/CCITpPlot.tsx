import * as d3 from "d3";
import type { CCIFeature } from "@/apis";
import type { PriceChartType } from "@/components/stocks/shared";
import {
  cciIDPrefix,
  cciTpFeatures,
  toggleCCIElement,
} from "@stocks/plot/interactions/cci";
import {
  getCircleID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
} from "@stocks/plot/interactions/d3-utils";
import { colorPalette, svgConfig } from "@/lib/theme";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";

type CCITpPlot = {
  features: CCIFeature[];
  chartType: PriceChartType;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function CCITpPlot({ features, chartType, x, y }: CCITpPlot) {
  const { t } = useTranslation();
  const { strokeWidth, circleR, circleStroke } = svgConfig;
  const paths = getPaths<"cci">(features, cciTpFeatures, x, y);
  const lastFeature = features.at(-1)!;
  return (
    <>
      {cciTpFeatures.map((featureName, i) => (
        <g key={getLineID(cciIDPrefix, featureName)}>
          <path
            id={getLineID(cciIDPrefix, featureName)}
            d={paths[featureName]}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
          />
          <Legend
            legendId={getLegendID(cciIDPrefix, featureName)}
            valueId={getLegendValueID(cciIDPrefix, featureName)}
            color={colorPalette[i]}
            index={i}
            label={t(`featureName.${featureName}`)}
            value={features.at(-1)![featureName].toFixed(2)}
            onMouseDown={() => toggleCCIElement(featureName)}
          />
        </g>
      ))}
      <g id={getCirclesGroupID(cciIDPrefix)} opacity={chartType === "line" ? 1 : 0}>
        {cciTpFeatures.map((featureName, i) => (
          <circle
            key={getCircleID(cciIDPrefix, featureName)}
            id={getCircleID(cciIDPrefix, featureName)}
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
