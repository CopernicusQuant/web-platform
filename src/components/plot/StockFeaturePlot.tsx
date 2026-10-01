import * as d3 from "d3";
import { useAtomValue } from "jotai";
import type { FeatureGroupOpt, StockData, PriceMomentumFeature } from "@/apis/stock";
import { stockSelectionAtom } from "@/atoms/stocks";
import { getHoverPlotFn, getLeavePlotFn } from "@/components/plot/interactions/hover";
import { plotSizeConfig } from "@/components/plot/theme";
import XAxis from "@/components/plot/XAxis";
import StockFeatureIndicators from "@/components/plot/StockFeatureIndicators";
import PMFeature from "@/components/plot/price-momentum/PMFeature";

type StockFeaturePlotProps = {
  data: StockData<FeatureGroupOpt>;
  width: number;
  featureGroup: FeatureGroupOpt;
  maxXTickNum?: number;
};

export default function StockFeaturePlot({
  data,
  width,
  featureGroup,
  maxXTickNum = 30,
}: StockFeaturePlotProps) {
  const {
    featurePlotHeight: height,
    marginRight,
    marginBottom,
    marginLeft,
  } = plotSizeConfig;
  const { featureSubPlot } = useAtomValue(stockSelectionAtom);
  const { stock, features } = data;
  const x = d3
    .scaleBand(
      features.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  const xSteps = Math.floor(features.length / maxXTickNum);
  const xLabels = features
    .filter((_, i) => (features.length - 1 - i) % xSteps == 0)
    .map((d) => d.tradeDate);

  // controls hover-based indicators
  const onPointerMove = getHoverPlotFn({
    data,
    featureGroup,
    width,
  });
  const onPointerLeave = getLeavePlotFn({
    stock,
    featureGroup,
    width,
  });

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible hover:cursor-crosshair"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <XAxis labels={xLabels} x={x} xPos={0} yPos={height - marginBottom} />
      {featureGroup === "priceMomentum" && (
        <PMFeature
          features={features as PriceMomentumFeature[]}
          x={x}
          subplotName={featureSubPlot}
        />
      )}
      <StockFeatureIndicators height={height} />
    </svg>
  );
}
