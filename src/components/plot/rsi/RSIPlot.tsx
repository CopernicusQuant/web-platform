import * as d3 from "d3";
import YAxis from "@/components/ui/YAxis";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getYScale,
} from "@plot/interactions/d3-utils";
import { rsiFeatures, rsiIDPrefix, toggleRSIFeature } from "@plot/interactions/rsi";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgPathConfig } from "@plot/theme";
import type { RSIFeature } from "@/apis";
import Legend from "@/components/ui/Legend";

export default function RSIPlot({ features, x, width, height }: SubplotProps<"rsi">) {
  const { strokeWidth, shadeOpacity, markStrokeDasharray, markStrokeWidth } =
    svgPathConfig;
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;
  const values = features.reduce((acc, feature) => {
    rsiFeatures.forEach((featureName) => acc.push(feature[featureName]));
    return acc;
  }, [] as number[]);
  const lastFeature = features.at(-1);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths: Record<string, string> = {};
  rsiFeatures.forEach((featureName) => {
    const path = d3
      .line<RSIFeature>()
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
  });
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      <g>
        <rect
          x={x.range()[0]}
          y={y.range()[1]}
          width={x.range()[1] - x.range()[0]}
          height={y(70) - y.range()[1]}
          fill={priceColors.down}
          opacity={shadeOpacity}
        />
        <line
          x1={x.range()[0]}
          x2={x.range()[1]}
          y1={y(70)}
          y2={y(70)}
          strokeWidth={markStrokeWidth}
          strokeDasharray={markStrokeDasharray}
          stroke={priceColors.down}
        />
      </g>
      <g>
        <rect
          x={x.range()[0]}
          y={y(30)}
          width={x.range()[1] - x.range()[0]}
          height={y.range()[0] - y(30)}
          fill={priceColors.up}
          opacity={shadeOpacity}
        />
        <line
          x1={x.range()[0]}
          x2={x.range()[1]}
          y1={y(30)}
          y2={y(30)}
          strokeWidth={markStrokeWidth}
          strokeDasharray={markStrokeDasharray}
          stroke={priceColors.up}
        />
      </g>
      <line
        x1={x.range()[0]}
        x2={x.range()[1]}
        y1={y(50)}
        y2={y(50)}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
        stroke={"black"}
      />
      {rsiFeatures.map((featureName, i) => (
        <g key={getLineID(rsiIDPrefix, featureName)}>
          <path
            id={getLineID(rsiIDPrefix, featureName)}
            d={paths[featureName]}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
          />
          <Legend
            legendId={getLegendID(rsiIDPrefix, featureName)}
            valueId={getLegendValueID(rsiIDPrefix, featureName)}
            index={i}
            label={`${featureName.match(/\d+/)}D`}
            value={lastFeature![featureName].toFixed(2)}
            onMouseDown={() => toggleRSIFeature(featureName)}
          />
        </g>
      ))}
    </>
  );
}
