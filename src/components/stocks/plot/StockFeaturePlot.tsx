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
  FeatureGroupOpt,
} from "@/apis";
import { getHoverPlotFn, getLeavePlotFn } from "@stocks/plot/interactions/hover";
import { plotSizeConfig } from "@/lib/theme";
import XAxis from "@/components/ui/XAxis";
import StockFeatureIndicators from "@stocks/plot/StockFeatureIndicators";
import PMFeature from "@stocks/plot/price-momentum/PMFeature";
import { plotConfigAtom } from "@/atoms/plot";
import MACDFeaturePlot from "@stocks/plot/macd/MACDFeaturePlot";
import MarketFeaturePlot from "@stocks/plot/market-activity/MarketFeaturePlot";
import BBFeaturePlot from "@stocks/plot/bollinger-bands/BBFeaturePlot";
import DEMAFeaturePlot from "@stocks/plot/dema/DEMAFeaturePlot";
import VolumeFeaturePlot from "@stocks/plot/volume-momentum/VolumeFeaturePlot";
import RSIPlot from "@stocks/plot/rsi/RSIPlot";
import OBVFeaturePlot from "@stocks/plot/obv/OBVFeaturePlot";
import KDJCorePlot from "@stocks/plot/kdj/KDJCorePlot";
import CCICorePlot from "@stocks/plot/cci/CCICorePlot";
import VolatilityFeaturesPlot from "@stocks/plot/volatility/VolatilityFeaturesPlot";
import { stockRouteAPI } from "@/routes/stocks.$ticker";

type StockFeaturePlotProps = {
  width: number;
  height: number;
  featureGroup: FeatureGroupOpt;
  featureSubPlot: string;
  maxXTickNum?: number;
};

export default function StockFeaturePlot({
  width,
  featureGroup,
  featureSubPlot,
  height,
  maxXTickNum = 30,
}: StockFeaturePlotProps) {
  const { marginRight, marginBottom, marginLeft } = plotSizeConfig;
  const { referenceHeight } = useAtomValue(plotConfigAtom);
  const { features, prices } = stockRouteAPI.useLoaderData();
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
    prices,
    features,
    featureGroup,
    width,
    referenceHeight,
  });
  const onPointerLeave = getLeavePlotFn({
    prices,
    features,
    featureGroup,
    width,
    referenceHeight,
  });

  const getFeaturePlot = () => {
    switch (featureGroup) {
      case "pricemomentum":
        return (
          <PMFeature
            features={features as PriceMomentumFeature[]}
            width={width}
            height={height}
            x={x}
            subplotName={featureSubPlot}
          />
        );
      case "volumemomentum":
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
      case "marketactivity":
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
      case "bollingerbands":
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
