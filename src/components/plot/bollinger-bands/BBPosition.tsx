import * as d3 from "d3";
import {
  bbIDPrefix,
  positionFeature,
  toggleBBFeature,
} from "@plot/interactions/bollinger-bands";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, priceColors, svgPathConfig } from "@plot/theme";
import type { BollingerBandsFeature } from "@/apis";
import YAxis from "@/components/ui/YAxis";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";
import { getLegendID, getLegendValueID, getLineID } from "@plot/interactions/d3-utils";

export default function BBPosition({
  features,
  width,
  height,
  x,
}: SubplotProps<"bollingerBands">) {
  const { t } = useTranslation();
  let [yMax, yMin] = [1.0, 0.0];
  const { strokeWidth, markStrokeDasharray, markStrokeWidth, shadeOpacity } =
    svgPathConfig;
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  features.forEach((feature) => {
    yMax = Math.max(yMax, feature[positionFeature]);
    yMin = Math.min(yMin, feature[positionFeature]);
  });
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );
  const path = d3
    .line<BollingerBandsFeature>()
    .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y((feature) => y(feature[positionFeature]))(features);
  if (!path) return <></>;
  const [xStart, xEnd] = x.range();
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value) => value.toFixed(1)}
      />
      {/* Bollinger Band boundaries */}
      <line
        x1={xStart}
        x2={xEnd}
        y1={y(1.0)}
        y2={y(1.0)}
        stroke={priceColors.up}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
      <rect
        x={xStart}
        y={marginTop}
        width={xEnd - xStart}
        height={y(1.0) - y.range()[1]}
        fill={priceColors.up}
        opacity={shadeOpacity}
      />
      <line
        x1={xStart}
        x2={xEnd}
        y1={y(0.0)}
        y2={y(0.0)}
        stroke={priceColors.down}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
      <rect
        x={xStart}
        y={y(0.0)}
        width={xEnd - xStart}
        height={y.range()[0] - y(0.0)}
        fill={priceColors.down}
        opacity={shadeOpacity}
      />
      <line
        x1={xStart}
        x2={xEnd}
        y1={y(0.5)}
        y2={y(0.5)}
        stroke={"black"}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
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
