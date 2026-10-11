import * as d3 from "d3";
import type { BollingerBandsFeature } from "@/apis";
import { colorPalette } from "@plot/theme";
import type { PriceChartType } from "@/atoms/stocks";
import Legend from "@/components/ui/Legend";
import {
  bandFeatures,
  getBBCircleGroupID,
  getBBCircleID,
  getBBGroupID,
  getBBLegendID,
  getBBLegendValueID,
  getBBLineID,
  toggleBand,
  toggleBBFeature,
} from "@plot/interactions/bollinger-bands";
import { legendConfig } from "@plot/theme";

type BollingerBandsProps = {
  features: BollingerBandsFeature[];
  chartType: PriceChartType;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function BollingerBands({
  features,
  chartType,
  x,
  y,
}: BollingerBandsProps) {
  const { featureWidthWidest, featureGap } = legendConfig;

  const area = d3
    .area<BollingerBandsFeature>()
    .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
    .y0((feature) => Math.min(y(feature.bbLower), y.range()[0]))
    .y1((feature) => Math.max(y(feature.bbUpper), y.range()[1]))(features);
  const paths: Record<string, string> = {};
  bandFeatures.forEach((featureName) => {
    const path = d3
      .line<BollingerBandsFeature>()
      .defined(
        (feature) =>
          feature[featureName] >= y.domain()[0] && feature[featureName] <= y.domain()[1],
      )
      .x((feature) => (x(feature.tradeDate) ?? 0) + x.bandwidth() / 2)
      .y((feature) => y(feature[featureName]))(features);
    if (path !== null) paths[featureName] = path;
  });

  if (!area) return <></>;
  const lastFeature = features.at(-1)!;
  return (
    <>
      {/* BB Band */}
      <g id={getBBGroupID()}>
        <path d={area} fill={colorPalette[2]} opacity={0.1} />
        {["bbUpper", "bbLower"].map((featureName) => (
          <path
            key={getBBLineID(featureName)}
            d={paths[featureName]}
            stroke={colorPalette[2]}
            strokeWidth={1.2}
            fill="none"
            strokeDasharray={"12 3"}
          />
        ))}
      </g>
      <g>
        <path
          id={getBBLineID("bbMid")}
          d={paths["bbMid"]}
          stroke={colorPalette[0]}
          strokeWidth={1.5}
          fill="none"
        />
      </g>
      <Legend
        legendId={getBBLegendID("band")}
        valueId={getBBLegendValueID("band")}
        value={`L ${lastFeature["bbLower"].toFixed(2)} U ${lastFeature["bbUpper"].toFixed(2)}`}
        index={0}
        label="BB"
        size="widest"
        color={colorPalette[2]}
        onMouseDown={toggleBand}
      />
      {/* BB Mid */}
      <g transform={`translate(${featureWidthWidest + featureGap} 0)`}>
        <Legend
          legendId={getBBLegendID("bbMid")}
          valueId={getBBLegendValueID("bbMid")}
          value={lastFeature["bbMid"].toFixed(2)}
          index={0}
          label="Mid"
          color={colorPalette[0]}
          onMouseDown={() => toggleBBFeature("bbMid")}
        />
      </g>
      {chartType === "line" && (
        <g id={getBBCircleGroupID("bbMid")} opacity={0}>
          <circle
            id={getBBCircleID("bbMid")}
            cx={0}
            cy={0}
            r={5}
            stroke="white"
            fill={colorPalette[0]}
            strokeWidth={2}
          />
        </g>
      )}
    </>
  );
}
