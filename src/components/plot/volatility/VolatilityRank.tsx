import Legend from "@/components/ui/Legend";
import YAxis from "@/components/ui/YAxis";
import {
  getCircleID,
  getCirclesGroupID,
  getLegendID,
  getLegendValueID,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  toggleVolatilityFeature,
  volatilityIDPrefix,
  volatilityRankFeature,
} from "@plot/interactions/volatility";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig } from "@plot/theme";
import { useTranslation } from "react-i18next";

export default function VolatilityRank({
  features,
  width,
  height,
  x,
}: SubplotProps<"volatility">) {
  const { t } = useTranslation();
  const { marginLeft, marginRight, marginBottom, marginTop } = plotSizeConfig;
  const values = features.map((feature) => feature[volatilityRankFeature]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const lastFeature = features.at(-1)!;
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      <g>
        <g id={getCirclesGroupID(volatilityRankFeature)}>
          {features.map((feature) => (
            <circle
              key={getCircleID(
                volatilityIDPrefix,
                volatilityRankFeature + feature.tradeDate,
              )}
              cx={(x(feature.tradeDate) ?? 0) + x.bandwidth() / 2}
              cy={y(feature[volatilityRankFeature])}
              r={3}
              strokeWidth={2}
              fill={"white"}
              stroke={colorPalette[0]}
            />
          ))}
        </g>
        <Legend
          legendId={getLegendID(volatilityIDPrefix, volatilityRankFeature)}
          valueId={getLegendValueID(volatilityIDPrefix, volatilityRankFeature)}
          index={0}
          label={t(`featureName.${volatilityRankFeature}`)}
          value={lastFeature[volatilityRankFeature].toFixed(2)}
          onMouseDown={() => toggleVolatilityFeature(volatilityRankFeature)}
        />
      </g>
    </>
  );
}
