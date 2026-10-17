import * as d3 from "d3";
import YAxis from "@/components/ui/YAxis";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getYScale,
} from "@plot/interactions/d3-utils";
import { kdjCoreFeatures, kdjIDPrefix, toggleKDJElement } from "@plot/interactions/kdj";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgConfig } from "@plot/theme";
import type { KDJFeature } from "@/apis";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";

export default function KDJCorePlot({ features, width, height, x }: SubplotProps<"kdj">) {
  const { t } = useTranslation();
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;
  const { strokeWidth, shadeOpacity, markStrokeDasharray, markStrokeWidth } = svgConfig;
  const values = features.reduce((acc, feature) => {
    kdjCoreFeatures.forEach((featureName) => acc.push(feature[featureName]));
    return acc;
  }, [] as number[]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths: Record<string, string> = {};
  kdjCoreFeatures.forEach((featureName) => {
    const path = d3
      .line<KDJFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
  });

  const lastFeature = features.at(-1)!;
  const [xStart, xEnd] = x.range();
  const [yEnd, yStart] = y.range();

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      {y.domain()[1] >= 80 && (
        <g>
          <rect
            x={xStart}
            y={yStart}
            width={xEnd - xStart}
            height={y(80) - yStart}
            fill={priceColors.down}
            opacity={shadeOpacity}
          />
          <line
            x1={xStart}
            x2={xEnd}
            y1={y(80)}
            y2={y(80)}
            strokeWidth={markStrokeWidth}
            strokeDasharray={markStrokeDasharray}
            stroke={priceColors.down}
          />
        </g>
      )}
      {y.domain()[0] <= 20 && (
        <g>
          <rect
            x={xStart}
            y={y(20)}
            width={xEnd - xStart}
            height={yEnd - y(20)}
            fill={priceColors.up}
            opacity={shadeOpacity}
          />
          <line
            x1={xStart}
            x2={xEnd}
            y1={y(20)}
            y2={y(20)}
            strokeWidth={markStrokeWidth}
            strokeDasharray={markStrokeDasharray}
            stroke={priceColors.up}
          />
        </g>
      )}
      <line
        x1={xStart}
        x2={xEnd}
        y1={y(50)}
        y2={y(50)}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
        stroke={"black"}
      />
      {kdjCoreFeatures.map((featureName, i) => (
        <g key={getLineID(kdjIDPrefix, featureName)}>
          <path
            id={getLineID(kdjIDPrefix, featureName)}
            d={paths[featureName]}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
          />
          <Legend
            legendId={getLegendID(kdjIDPrefix, featureName)}
            valueId={getLegendValueID(kdjIDPrefix, featureName)}
            index={i}
            label={t(`featureName.${featureName}`)}
            onMouseDown={() => toggleKDJElement(featureName)}
            value={lastFeature[featureName].toFixed(2)}
          />
        </g>
      ))}
    </>
  );
}
