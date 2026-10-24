import Legend from "@/components/ui/Legend";
import YAxis from "@/components/ui/YAxis";
import {
  getBarGroupID,
  getFeatureValues,
  getLegendID,
  getLegendValueID,
  getYScale,
} from "@stocks/plot/interactions/d3-utils";
import {
  obvIDPrefix,
  obvMomentumFeatures,
  toggleOBVElements,
} from "@stocks/plot/interactions/obv";
import type { SubplotProps } from "@/components/stocks/shared";
import { plotSizeConfig, priceColors } from "@/lib/theme";
import { useTranslation } from "react-i18next";

export default function OBVMomentum({ features, width, height, x }: SubplotProps<"obv">) {
  const { t } = useTranslation();
  const { marginTop, marginRight, marginBottom, marginLeft } = plotSizeConfig;
  const values = getFeatureValues<"obv">(features, obvMomentumFeatures);
  const y = getYScale(values, height - marginBottom, marginTop);
  const lastFeature = features.at(-1)!;
  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
      />
      {obvMomentumFeatures.map((featureName, i) => (
        <g key={getBarGroupID(obvIDPrefix, featureName)}>
          <g id={getBarGroupID(obvIDPrefix, featureName)}>
            {features.map((feature) => {
              const positive = feature[featureName] >= 0;
              return (
                <rect
                  key={`obv-rect-${feature.tradeDate}`}
                  x={x(feature.tradeDate)}
                  y={positive ? y(feature[featureName]) : y(0)}
                  width={x.bandwidth()}
                  height={Math.abs(y(0) - y(feature[obvMomentumFeatures[0]]))}
                  fill={positive ? priceColors.up : priceColors.down}
                  opacity={0.9}
                />
              );
            })}
          </g>
          <Legend
            legendId={getLegendID(obvIDPrefix, featureName)}
            valueId={getLegendValueID(obvIDPrefix, featureName)}
            index={i}
            color={lastFeature[featureName] >= 0 ? priceColors.up : priceColors.down}
            label={t(`featureName.${featureName}`)}
            size="wider"
            value={lastFeature[featureName].toFixed(2)}
            onMouseDown={() => toggleOBVElements(featureName)}
          />
        </g>
      ))}
    </>
  );
}
