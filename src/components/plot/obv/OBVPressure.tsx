import * as d3 from "d3";
import YAxis from "@/components/ui/YAxis";
import { digitToPercent } from "@/lib/utils";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  obvIDPrefix,
  obvPressureFeatures,
  toggleOBVElements,
} from "@plot/interactions/obv";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgPathConfig } from "@plot/theme";
import type { OBVFeature } from "@/apis";
import Legend from "@/components/ui/Legend";

export default function OBVPressure({ features, width, height, x }: SubplotProps<"obv">) {
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;
  const { strokeWidth, markStrokeWidth, markStrokeDasharray, shadeOpacity } =
    svgPathConfig;
  const values = features.reduce((acc, feature) => {
    obvPressureFeatures.forEach((featureName) => acc.push(feature[featureName]));
    return acc;
  }, [] as number[]);
  const [xStart, xEnd] = x.range();
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths: Record<string, string> = {};
  obvPressureFeatures.forEach((featureName) => {
    const path = d3
      .line<OBVFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
  });
  const labels = obvPressureFeatures.map((featureName) => `${featureName.match(/\d+/)}D`);
  const lastFeature = features.at(-1)!;
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value: number) => digitToPercent(value, 0)}
      />
      <rect
        x={xStart}
        y={y.range()[1]}
        width={xEnd - xStart}
        height={y(0) - y.range()[1]}
        fill={priceColors.up}
        opacity={shadeOpacity - 0.1}
      />
      <rect
        x={xStart}
        y={y(0)}
        width={xEnd - xStart}
        height={y.range()[0] - y(0)}
        fill={priceColors.down}
        opacity={shadeOpacity - 0.1}
      />
      {obvPressureFeatures.map((featureName, i) => (
        <g key={getLineID(obvIDPrefix, featureName)}>
          <path
            id={getLineID(obvIDPrefix, featureName)}
            d={paths[featureName]}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
          />
          <Legend
            legendId={getLegendID(obvIDPrefix, featureName)}
            valueId={getLegendValueID(obvIDPrefix, featureName)}
            index={i}
            label={labels[i]}
            value={digitToPercent(lastFeature[featureName], 2)}
            onMouseDown={() => toggleOBVElements(featureName)}
          />
        </g>
      ))}
      <line
        x1={xStart}
        x2={xEnd}
        y1={y(0)}
        y2={y(0)}
        stroke="black"
        strokeDasharray={markStrokeDasharray}
        strokeWidth={markStrokeWidth}
      />
    </>
  );
}
