import {
  bbIDPrefix,
  positionFeature,
  toggleBBFeature,
} from "@plot/interactions/bollinger-bands";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgConfig } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import ShadeRegion from "@/components/ui/ShadeRegion";

export default function BBPosition({
  features,
  width,
  height,
  x,
}: SubplotProps<"bollingerBands">) {
  const { t } = useTranslation();
  const { strokeWidth } = svgConfig;
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const values = features.map((feature) => feature[positionFeature]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const path = getPaths<"bollingerBands">(features, [positionFeature], x, y)[
    positionFeature
  ];
  if (!path) return <></>;
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value) => value.toFixed(1)}
      />
      {/* Bollinger Band boundaries */}
      <ShadeRegion
        x={x}
        y={y}
        upper={1.0}
        lower={0.0}
        center={0.5}
        upperColor={priceColors.up}
        lowerColor={priceColors.down}
      />
      {/* position feature */}
      <path
        id={getLineID(bbIDPrefix, positionFeature)}
        d={path}
        fill="none"
        strokeWidth={strokeWidth}
        stroke={colorPalette[2]}
      />
      {/* Legend */}
      <Legend
        legendId={getLegendID(bbIDPrefix, positionFeature)}
        valueId={getLegendValueID(bbIDPrefix, positionFeature)}
        index={0}
        value={features.at(-1)![positionFeature].toFixed(2)}
        label={t(`featureName.${positionFeature}`)}
        color={colorPalette[2]}
        onMouseDown={() => toggleBBFeature(positionFeature)}
      />
    </>
  );
}
