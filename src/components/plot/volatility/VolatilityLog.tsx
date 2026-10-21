import Legend from "@/components/ui/Legend";
import YAxis from "@/components/ui/YAxis";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";
import {
  toggleVolatilityFeature,
  volatilityIDPrefix,
  volatilityLogFeature,
} from "@plot/interactions/volatility";
import type { SubplotProps } from "@plot/shared";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import { useTranslation } from "react-i18next";

export default function VolatilityLog({
  features,
  width,
  height,
  x,
}: SubplotProps<"volatility">) {
  const { t } = useTranslation();
  const { strokeWidth } = svgConfig;
  const { marginLeft, marginRight, marginBottom, marginTop } = plotSizeConfig;
  const values = features.map((feature) => feature[volatilityLogFeature]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const paths = getPaths<"volatility">(features, [volatilityLogFeature], x, y);
  const lastFeature = features.at(-1)!;

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      {Object.entries(paths).map(([featureName, value], i) => (
        <g key={getLineID(volatilityIDPrefix, featureName)}>
          <path
            id={getLineID(volatilityIDPrefix, featureName)}
            d={value}
            fill="none"
            stroke={colorPalette[i]}
            strokeWidth={strokeWidth}
          />
          <Legend
            legendId={getLegendID(volatilityIDPrefix, featureName)}
            valueId={getLegendValueID(volatilityIDPrefix, featureName)}
            label={t(`featureName.${featureName}`)}
            index={i}
            value={lastFeature["volatilityLog"].toFixed(2)}
            onMouseDown={() => toggleVolatilityFeature(featureName)}
          />
        </g>
      ))}
    </>
  );
}
