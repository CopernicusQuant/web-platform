import * as d3 from "d3";
import { useAtomValue } from "jotai";
import type {
  PriceMomentumFeature,
  MarketActivityFeature,
  MACDFeature,
  BollingerBandsFeature,
  DEMAFeature,
  VolumeMomentumFeature,
  RSIFeature,
  OBVFeature,
  KDJFeature,
  CCIFeature,
  VolatilityFeature,
} from "@/apis";
import { useGetStockFeaturesQuery } from "@/hooks/queries/useGetStockFeaturesQuery";
import { useGetStockPriceQuery } from "@/hooks/queries/useGetStockPriceQuery";
import { stockSelectionAtom } from "@/atoms/stocks";
import { getHoverPlotFn, getLeavePlotFn } from "@plot/interactions/hover";
import { plotSizeConfig } from "@plot/theme";
import XAxis from "@/components/ui/XAxis";
import StockFeatureIndicators from "@plot/StockFeatureIndicators";
import PMFeature from "@plot/price-momentum/PMFeature";
import { plotConfigAtom } from "@/atoms/plot";
import MACDFeaturePlot from "@plot/macd/MACDFeaturePlot";
import MarketFeaturePlot from "@plot/market-activity/MarketFeaturePlot";
import BBFeaturePlot from "@plot/bollinger-bands/BBFeaturePlot";
import DEMAFeaturePlot from "@plot/dema/DEMAFeaturePlot";
import VolumeFeaturePlot from "@plot/volume-momentum/VolumeFeaturePlot";
import RSIPlot from "@plot/rsi/RSIPlot";
import OBVFeaturePlot from "@plot/obv/OBVFeaturePlot";
import KDJCorePlot from "@plot/kdj/KDJCorePlot";
import CCICorePlot from "@plot/cci/CCICorePlot";
import VolatilityFeaturesPlot from "./volatility/VolatilityFeaturesPlot";

type StockFeaturePlotProps = {
  width: number;
  height: number;
  maxXTickNum?: number;
};

export default function StockFeaturePlot({
  width,
  height,
  maxXTickNum = 30,
}: StockFeaturePlotProps) {
  const { marginRight, marginBottom, marginLeft } = plotSizeConfig;
  const { ticker, window, featureGroup } = useAtomValue(stockSelectionAtom);
  const { featureSubPlot } = useAtomValue(stockSelectionAtom);
  const { referenceHeight } = useAtomValue(plotConfigAtom);
  const { data: stock } = useGetStockPriceQuery(ticker, window);
  const { data: features } = useGetStockFeaturesQuery(ticker, window, featureGroup);
  if (!features) return <></>;

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
    stock,
    features,
    featureGroup,
    width,
    referenceHeight,
  });
  const onPointerLeave = getLeavePlotFn({
    stock,
    features,
    featureGroup,
    width,
    referenceHeight,
  });

  const getFeaturePlot = () => {
    switch (featureGroup) {
      case "priceMomentum":
        return (
          <PMFeature
            features={features as PriceMomentumFeature[]}
            width={width}
            height={height}
            x={x}
            subplotName={featureSubPlot}
          />
        );
      case "volumeMomentum":
        return (
          <VolumeFeaturePlot
            features={features as VolumeMomentumFeature[]}
            width={width}
            height={height}
            x={x}
            subplotName={featureSubPlot}
          />
        );
      case "volatility":
        return (
          <VolatilityFeaturesPlot
            features={features as VolatilityFeature[]}
            width={width}
            height={height}
            subplotName={featureSubPlot}
            x={x}
          />
        );
      case "obv":
        return (
          <OBVFeaturePlot
            features={features as OBVFeature[]}
            width={width}
            height={height}
            x={x}
            subplotName={featureSubPlot}
          />
        );
      case "marketActivity":
        return (
          <MarketFeaturePlot
            features={features as MarketActivityFeature[]}
            width={width}
            height={height}
            x={x}
            subplotName={featureSubPlot}
          />
        );
      case "macd":
        return (
          <MACDFeaturePlot
            features={features as MACDFeature[]}
            width={width}
            height={height}
            x={x}
          />
        );
      case "bollingerBands":
        return (
          <BBFeaturePlot
            features={features as BollingerBandsFeature[]}
            subplotName={featureSubPlot}
            width={width}
            height={height}
            x={x}
          />
        );
      case "dema":
        return (
          <DEMAFeaturePlot
            features={features as DEMAFeature[]}
            width={width}
            height={height}
            x={x}
          />
        );
      case "rsi":
        return (
          <RSIPlot
            features={features as RSIFeature[]}
            width={width}
            height={height}
            x={x}
          />
        );
      case "kdj":
        return (
          <KDJCorePlot
            features={features as KDJFeature[]}
            width={width}
            height={height}
            x={x}
          />
        );
      case "cci":
        return (
          <CCICorePlot
            features={features as CCIFeature[]}
            width={width}
            height={height}
            x={x}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible hover:cursor-crosshair"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <XAxis labels={xLabels} x={x} xPos={0} yPos={height - marginBottom} />
      {getFeaturePlot()}
      <StockFeatureIndicators height={height} />
    </svg>
  );
}
