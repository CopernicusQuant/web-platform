import * as d3 from "d3";
import { useAtomValue } from "jotai";
import type {
  FeatureGroupOpt,
  StockData,
  PriceMomentumFeature,
  MarketActivityFeature,
  MACDFeature,
} from "@/apis";
import { stockSelectionAtom } from "@/atoms/stocks";
import { getHoverPlotFn, getLeavePlotFn } from "@plot/interactions/hover";
import { plotSizeConfig } from "@plot/theme";
import XAxis from "@/components/ui/XAxis";
import StockFeatureIndicators from "@plot/StockFeatureIndicators";
import PMFeature from "@plot/price-momentum/PMFeature";
import { plotConfigAtom } from "@/atoms/plot";
import MACDFeaturePlot from "./macd/MACDFeaturePlot";
import MarketFeature from "./market-activity/MarketFeature";

type StockFeaturePlotProps = {
  data: StockData<FeatureGroupOpt>;
  width: number;
  height: number;
  featureGroup: FeatureGroupOpt;
  maxXTickNum?: number;
};

export default function StockFeaturePlot({
  data,
  width,
  height,
  featureGroup,
  maxXTickNum = 30,
}: StockFeaturePlotProps) {
  const { marginRight, marginBottom, marginLeft } = plotSizeConfig;
  const { featureSubPlot } = useAtomValue(stockSelectionAtom);
  const { referenceHeight } = useAtomValue(plotConfigAtom);
  const { features } = data;
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
    referenceHeight,
  });
  const onPointerLeave = getLeavePlotFn({
    data,
    featureGroup,
    width,
    referenceHeight,
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
          width={width}
          height={height}
          x={x}
          subplotName={featureSubPlot}
        />
      )}
      {featureGroup === "marketActivity" && (
        <MarketFeature
          features={features as MarketActivityFeature[]}
          width={width}
          height={height}
          x={x}
          subplotName={featureSubPlot}
        />
      )}
      {featureGroup === "macd" && (
        <MACDFeaturePlot
          features={features as MACDFeature[]}
          width={width}
          height={height}
          x={x}
        />
      )}
      <StockFeatureIndicators height={height} />
    </svg>
  );
}
