import { useAtomValue } from "jotai";
import { demaPeriodAtom } from "@/atoms/plot";
import { digitToPercent } from "@/lib/utils";
import {
  demaIDPrefix,
  getDEMAFeatureNamesByPeriod,
  toggleDEMAFeature,
} from "@plot/interactions/dema";
import type { SubplotProps } from "@/components/shared";
import DEMASignals from "@plot/dema/DEMASignals";
import { colorPalette, plotSizeConfig, svgConfig } from "@plot/theme";
import YAxis from "@/components/ui/YAxis";
import Legend from "@/components/ui/Legend";
import {
  getLegendID,
  getLegendValueID,
  getLineID,
  getPaths,
  getYScale,
} from "@plot/interactions/d3-utils";

export default function DEMASpread({ features, width, height, x }: SubplotProps<"dema">) {
  const { marginLeft, marginRight, marginTop, marginBottom } = plotSizeConfig;
  const { strokeWidth, markStrokeWidth, markStrokeDasharray } = svgConfig;
  const demaPeriod = useAtomValue(demaPeriodAtom);
  const featureNames = getDEMAFeatureNamesByPeriod(demaPeriod);
  const spreadFeatureName = featureNames.filter((featureName) =>
    featureName.endsWith("spread"),
  )[0];
  const values = features.map((feature) => feature[spreadFeatureName]);
  const y = getYScale(values, height - marginBottom, marginTop);
  const path = getPaths<"dema">(features, [spreadFeatureName], x, y)[spreadFeatureName];
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
