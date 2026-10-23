import YAxis from "@/components/ui/YAxis";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import { rsiFeatures, rsiIDPrefix, toggleRSIFeature } from "@plot/interactions/rsi";
import type { SubplotProps } from "@/components/shared";
import { colorPalette, plotSizeConfig, priceColors, svgConfig } from "@plot/theme";
import Legend from "@/components/ui/Legend";
import ShadeRegion from "@/components/ui/ShadeRegion";

export default function RSIPlot({ features, x, width, height }: SubplotProps<"rsi">) {
  const { strokeWidth } = svgConfig;
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;

  const values = getFeatureValues<"rsi">(features, rsiFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"rsi">(features, rsiFeatures, x, y);
  const lastFeature = features.at(-1);
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      <ShadeRegion
        x={x}
        y={y}
        upper={70}
        lower={30}
        center={50}
        upperColor={priceColors.down}
        lowerColor={priceColors.up}
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
