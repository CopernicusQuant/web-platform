import { useMemo } from "react";
import type { PriceMomentumFeature } from "@/apis/stock";
import * as d3 from "d3";
import { returnFeatures } from "@/components/plot/interactions/price-momentum";
import { plotSizeConfig, priceColors } from "@/components/plot/theme";
import YAxis from "@/components/plot/YAxis";

type ReturnsProps = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  width: number;
};

export default function Returns({ features, x, width }: ReturnsProps) {
  const {
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    featurePlotHeight: height,
  } = plotSizeConfig;
  // y-axis mapper
  const [yMin, yMax] = useMemo(() => {
    let yMin = Infinity;
    let yMax = -Infinity;
    features.forEach((feature) => {
      returnFeatures.forEach((featureName) => {
        yMin = Math.min(yMin, feature[featureName]);
        yMax = Math.max(yMax, feature[featureName]);
      });
    });
    const yPadding = (yMax - yMin) * 0.05 || 1;
    return [yMin - yPadding, yMax + yPadding];
  }, [features]);

  const y = d3.scaleLinear([yMin, yMax], [height - marginBottom, marginTop]);
  const opacities = [1.0, 0.5, 0.2];

  return (
    <g>
      <YAxis
        y={y}
        xPos={marginLeft}
        yPos={0}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelPostfix="%"
        labelFormatter={(value: number) => (value * 100).toFixed(1)}
      />
      {returnFeatures.map((featureName, i) => {
        return features.map((feature) => {
          const val = feature[featureName];
          return (
            <rect
              key={`pm-${feature.tradeDate}-${featureName}`}
              x={x(feature.tradeDate)}
              y={val >= 0 ? y(val) : y(0)}
              width={x.bandwidth()}
              height={Math.abs(y(val) - y(0))}
              opacity={opacities[i]}
              fill={val >= 0 ? priceColors.up : priceColors.down}
            />
          );
        });
      })}
    </g>
  );
}
