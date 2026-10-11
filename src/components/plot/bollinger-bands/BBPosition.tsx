import * as d3 from "d3";
import {
  getBBLegendID,
  getBBLegendValueID,
  getBBLineID,
  positionFeature,
  toggleBBFeature,
} from "@plot/interactions/bollinger-bands";
import type { BBSubplotProps } from "./shared";
import { colorPalette, plotSizeConfig, priceColors } from "@plot/theme";
import type { BollingerBandsFeature } from "@/apis";
import YAxis from "@/components/ui/YAxis";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";

export default function BBPosition({ features, width, height, x }: BBSubplotProps) {
  const { t } = useTranslation();
  let [yMax, yMin] = [1.0, 0.0];
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
  return (
    <>
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value) => value.toFixed(1)}
      />
      {/* Bollinger Band boundaries */}
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(1.0)}
        y2={y(1.0)}
        stroke={priceColors.up}
        strokeWidth={1.4}
        strokeDasharray={"6 4"}
      />
      <rect
        x={marginLeft}
        y={marginTop}
        width={width - marginLeft - marginRight}
        height={y(1.0) - y.range()[1]}
        fill={priceColors.up}
        opacity={0.15}
      />
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(0.0)}
        y2={y(0.0)}
        stroke={priceColors.down}
        strokeWidth={1.4}
        strokeDasharray={"6 4"}
      />
      <rect
        x={marginLeft}
        y={y(0.0)}
        width={width - marginLeft - marginRight}
        height={y.range()[0] - y(0.0)}
        fill={priceColors.down}
        opacity={0.15}
      />
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={y(0.5)}
        y2={y(0.5)}
        stroke={"black"}
        strokeWidth={1.4}
        strokeDasharray={"6 4"}
      />
      {/* position feature */}
      <path
        id={getBBLineID(positionFeature)}
        d={path}
        fill="none"
        strokeWidth={1.7}
        stroke={colorPalette[2]}
      />
      {/* Legend */}
      <Legend
        legendId={getBBLegendID(positionFeature)}
        valueId={getBBLegendValueID(positionFeature)}
        index={0}
        value={features.at(-1)![positionFeature].toFixed(2)}
        label={t(`featureName.${positionFeature}`)}
        color={colorPalette[2]}
        onMouseDown={() => toggleBBFeature(positionFeature)}
      />
    </>
  );
}
