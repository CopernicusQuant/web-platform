import YAxis from "@/components/ui/YAxis";
import { digitToPercent } from "@/lib/utils";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  obvIDPrefix,
  obvPressureFeatures,
  toggleOBVElements,
} from "@plot/interactions/obv";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgConfig } from "@plot/theme";
import Legend from "@/components/ui/Legend";

export default function OBVPressure({ features, width, height, x }: SubplotProps<"obv">) {
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;
  const { strokeWidth, markStrokeWidth, markStrokeDasharray, shadeOpacity } = svgConfig;
  const [xStart, xEnd] = x.range();
  const values = getFeatureValues<"obv">(features, obvPressureFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"obv">(features, obvPressureFeatures, x, y);
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
        opacity={shadeOpacity - 0.05}
      />
      <rect
        x={xStart}
        y={y(0)}
        width={xEnd - xStart}
        height={y.range()[0] - y(0)}
        fill={priceColors.down}
        opacity={shadeOpacity - 0.05}
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
