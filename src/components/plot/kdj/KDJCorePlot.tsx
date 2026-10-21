import YAxis from "@/components/ui/YAxis";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import { kdjCoreFeatures, kdjIDPrefix, toggleKDJElement } from "@plot/interactions/kdj";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgConfig } from "@plot/theme";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";
import ShadeRegion from "@/components/ui/ShadeRegion";

export default function KDJCorePlot({ features, width, height, x }: SubplotProps<"kdj">) {
  const { t } = useTranslation();
  const { marginTop, marginBottom, marginLeft, marginRight } = plotSizeConfig;
  const { strokeWidth } = svgConfig;
  const values = getFeatureValues<"kdj">(features, kdjCoreFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"kdj">(features, kdjCoreFeatures, x, y);
  const lastFeature = features.at(-1)!;

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
        upper={80}
        lower={20}
        center={50}
        upperColor={priceColors.down}
        lowerColor={priceColors.up}
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
