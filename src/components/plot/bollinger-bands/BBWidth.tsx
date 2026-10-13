import * as d3 from "d3";
import { colorPalette, plotSizeConfig, svgPathConfig } from "@plot/theme";
import type { SubplotProps } from "@plot/shared";
import {
  bbIDPrefix,
  toggleBBFeature,
  widthFeature,
} from "@plot/interactions/bollinger-bands";
import type { BollingerBandsFeature } from "@/apis";
import YAxis from "@/components/ui/YAxis";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";
import { getLegendID, getLegendValueID, getLineID } from "@plot/interactions/d3-utils";

export default function BBWidth({
  features,
  width,
  height,
  x,
}: SubplotProps<"bollingerBands">) {
  const { t } = useTranslation();
  let yMax = 0;
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { strokeDasharray, strokeWidth, markStrokeDasharray, markStrokeWidth } =
    svgPathConfig;
  features.forEach((feature) => {
    yMax = Math.max(yMax, feature[widthFeature] / 2);
  });
  const yPadding = yMax * 2 * 0.05 || 1;
  const y = d3.scaleLinear(
    [-yMax - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );
  const area = d3
    .area<BollingerBandsFeature>()
    .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y0((feature) => y(feature[widthFeature] / 2))
    .y1((feature) => y(-feature[widthFeature] / 2))(features);
  const upperEdge = d3
    .line<BollingerBandsFeature>()
    .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y((feature) => y(feature.bbWidth / 2))(features);
  const lowerEdge = d3
    .line<BollingerBandsFeature>()
    .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y((feature) => y(-feature.bbWidth / 2))(features);

  if (!area) return <></>;
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
      <g id={getLineID(bbIDPrefix, widthFeature)}>
        <path d={area} fill={colorPalette[2]} fillOpacity={0.3} />
        <path
          d={upperEdge!}
          fill={"none"}
          stroke={colorPalette[2]}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
        <path
          d={lowerEdge!}
          fill={"none"}
          stroke={colorPalette[2]}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
        />
      </g>
      <line
        x1={marginLeft + x.bandwidth() / 2}
        x2={width - marginRight - x.bandwidth() / 2}
        y1={y(0.0)}
        y2={y(0.0)}
        stroke={"black"}
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
      {/* Legend */}
      <Legend
        legendId={getLegendID(bbIDPrefix, widthFeature)}
        valueId={getLegendValueID(bbIDPrefix, widthFeature)}
        index={0}
        value={features.at(-1)![widthFeature].toFixed(2)}
        label={t(`featureName.${widthFeature}`)}
        color={colorPalette[2]}
        onMouseDown={() => toggleBBFeature(widthFeature)}
      />
    </>
  );
}
