import * as d3 from "d3";
import { useAtomValue } from "jotai";
import type { DEMAFeature } from "@/apis";
import { demaPeriodAtom } from "@/atoms/plot";
import { digitToPercent } from "@/lib/utils";
import {
  demaIDPrefix,
  getDEMAFeatureNamesByPeriod,
  toggleDEMAFeature,
} from "@plot/interactions/dema";
import type { SubplotProps } from "@plot/shared";
import DEMASignals from "@plot/dema/DEMASignals";
import { colorPalette, plotSizeConfig, svgPathConfig } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import Legend from "@/components/ui/Legend";
import { getLegendID, getLegendValueID, getLineID } from "@plot/interactions/d3-utils";

export default function DEMASpread({ features, width, height, x }: SubplotProps<"dema">) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { strokeWidth, markStrokeWidth, markStrokeDasharray } = svgPathConfig;
  const demaPeriod = useAtomValue(demaPeriodAtom);
  const featureNames = getDEMAFeatureNamesByPeriod(demaPeriod);
  const spreadFeatureName = featureNames.filter((featureName) =>
    featureName.endsWith("spread"),
  )[0];
  const yMin = d3.min(features, (d) => d[spreadFeatureName]) || 0;
  const yMax = d3.max(features, (d) => d[spreadFeatureName]) || 0;
  const yPadding = (yMax - yMin) * 0.05;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [height - marginBottom, marginTop],
  );
  const path = d3
    .line<DEMAFeature>()
    .x((feature) => (x(feature.tradeDate) || 0) + x.bandwidth() / 2)
    .y((feature) => y(feature[spreadFeatureName]))(features);

  if (!path) return <></>;

  return (
    <>
      <YAxis
        y={y}
        plotWidth={width - marginLeft - marginRight}
        labelXOffset={marginRight}
        labelFormatter={(value) => (value * 100).toFixed(2)}
        labelPostfix="%"
      />
      <DEMASignals features={features} x={x} y={y} currPlot="feature" />
      <line
        x1={marginLeft + x.bandwidth() / 2}
        x2={width - marginRight - x.bandwidth() / 2}
        y1={y(0)}
        y2={y(0)}
        stroke="black"
        strokeWidth={markStrokeWidth}
        strokeDasharray={markStrokeDasharray}
      />
      <path
        id={getLineID(demaIDPrefix, spreadFeatureName)}
        d={path}
        fill="none"
        stroke={colorPalette[0]}
        strokeWidth={strokeWidth}
      />
      <Legend
        legendId={getLegendID(demaIDPrefix, spreadFeatureName)}
        valueId={getLegendValueID(demaIDPrefix, spreadFeatureName)}
        index={0}
        label="Spread"
        value={digitToPercent(features.at(-1)![spreadFeatureName])}
        onMouseDown={() => toggleDEMAFeature(spreadFeatureName)}
      />
    </>
  );
}
