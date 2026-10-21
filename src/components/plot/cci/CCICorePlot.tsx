import YAxis from "@/components/ui/YAxis";
import { cciCoreFeatures, cciIDPrefix, toggleCCIElement } from "@plot/interactions/cci";
import {
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgConfig } from "@plot/theme";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";
import ShadeRegion from "@/components/ui/ShadeRegion";

export default function CCICorePlot({ features, x, width, height }: SubplotProps<"cci">) {
  const { t } = useTranslation();
  const { marginBottom, marginTop, marginLeft, marginRight } = plotSizeConfig;
  const { strokeWidth } = svgConfig;
  const values = getFeatureValues<"cci">(features, cciCoreFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"cci">(features, cciCoreFeatures, x, y);
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      <ShadeRegion
        upper={100}
        lower={-100}
        x={x}
        y={y}
        upperColor={priceColors.down}
        lowerColor={priceColors.up}
        center={0}
      />
      {cciCoreFeatures.map((featureName, i) => (
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
    </>
  );
}
