import * as d3 from "d3";
import type {
  FeatureGroupOpt,
  PriceMomentumFeature,
  MarketActivityFeature,
  MACDFeature,
  BollingerBandsFeature,
  DEMAFeature,
  VolumeMomentumFeature,
  RSIFeature,
  OBVFeature,
  KDJFeature,
  StockPrice,
  FeatureByGroup,
} from "@/apis";
import { updatePriceTrendIndicators, resetPriceTrendIndicators } from "./price-trend";
import {
  updateFeatureTrendIndicators,
  resetFeatureTrendIndicators,
} from "@plot/interactions/feature-trend";
import {
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
} from "@plot/interactions/price-momentum";
import { plotSizeConfig } from "@plot/theme";
import {
  resetMarketActivityIndicators,
  updateMarketActivityIndicators,
} from "./market-activity";
import { resetMACDIndicators, updateMACDIndicators } from "./macd";
import { resetBBIndicators, updateBBIndicators } from "./bollinger-bands";
import { resetDEMAIndicators, updateDEMAIndicators } from "./dema";
import { resetVolumeIndicators, updateVolumeIndicators } from "./volume-momentum";
import { updateRSIIndicators, resetRSIIndicators } from "./rsi";
import { resetOBVIndicators, updateOBVIndicators } from "./obv";
import { resetKDJIndicators, updateKDJIndicators } from "./kdj";

const getHoverPlotFn = <G extends FeatureGroupOpt>({
  stock,
  features,
  featureGroup,
  width,
  referenceHeight,
}: {
  stock: StockPrice[] | undefined;
  features: FeatureByGroup[G][] | undefined;
  featureGroup: FeatureGroupOpt;
  width: number;
  referenceHeight: number;
}) => {
  if (!stock) return;
  const { marginBottom, marginTop, marginLeft, marginRight } = plotSizeConfig;
  // x-axis mapper
  const x = d3
    .scaleBand(
      stock.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [referenceHeight - marginBottom, marginTop],
  );

  return (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerPos = event.clientX - rect.x - marginLeft;
    let xIdx = Math.floor(pointerPos / x.step());
    xIdx = Math.max(Math.min(xIdx, stock.length - 1), 0);
    updatePriceTrendIndicators({
      stock,
      pointerPos,
      xIdx,
      width,
      height: referenceHeight,
      marginRight,
      marginBottom,
      x,
      y,
    });
    updateFeatureTrendIndicators({
      stock,
      xIdx,
      x,
    });
    if (!features) return;
    switch (featureGroup) {
      case "priceMomentum":
        updatePriceMomentumIndicators({
          xIdx,
          features: features as PriceMomentumFeature[],
          height: referenceHeight,
          marginTop,
          marginBottom,
          x,
          y,
        });
        break;
      case "volumeMomentum":
        updateVolumeIndicators({
          xIdx,
          stock,
          features: features as VolumeMomentumFeature[],
        });
        break;
      case "obv":
        updateOBVIndicators({ features: features as OBVFeature[], xIdx });
        break;
      case "marketActivity":
        updateMarketActivityIndicators({
          stock,
          features: features as MarketActivityFeature[],
          xIdx,
        });
        break;
      case "macd":
        updateMACDIndicators({
          xIdx,
          features: features as MACDFeature[],
          height: referenceHeight,
          marginTop,
          marginBottom,
          x,
          y,
        });
        break;
      case "bollingerBands":
        updateBBIndicators({
          xIdx,
          features: features as BollingerBandsFeature[],
          height: referenceHeight,
          marginTop,
          marginBottom,
          x,
          y,
        });
        break;
      case "dema":
        updateDEMAIndicators({
          xIdx,
          features: features as DEMAFeature[],
          height: referenceHeight,
          marginTop,
          marginBottom,
          x,
          y,
        });
        break;
      case "rsi":
        updateRSIIndicators({ features: features as RSIFeature[], xIdx });
        break;
      case "kdj":
        updateKDJIndicators({ features: features as KDJFeature[], xIdx, x, y });
        break;
    }
  };
};

const getLeavePlotFn = <G extends FeatureGroupOpt>({
  stock,
  features,
  featureGroup,
  width,
  referenceHeight,
}: {
  stock: StockPrice[] | undefined;
  features: FeatureByGroup[G][] | undefined;
  featureGroup: FeatureGroupOpt;
  width: number;
  referenceHeight: number;
}) => {
  const { marginRight, marginBottom, marginTop } = plotSizeConfig;
  if (!stock) return;
  // y-axis mapper
  const yMax = d3.max(stock, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(stock, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [referenceHeight - marginBottom, marginTop],
  );
  return () => {
    resetPriceTrendIndicators({ stock, width, marginRight, y });
    resetFeatureTrendIndicators();
    if (!features) return;
    switch (featureGroup) {
      case "priceMomentum":
        resetPriceMomentumIndicators({ features: features as PriceMomentumFeature[] });
        break;
      case "volumeMomentum":
        resetVolumeIndicators({ features: features as VolumeMomentumFeature[], stock });
        break;
      case "obv":
        resetOBVIndicators({ features: features as OBVFeature[] });
        break;
      case "marketActivity":
        resetMarketActivityIndicators({
          stock,
          features: features as MarketActivityFeature[],
        });
        break;
      case "macd":
        resetMACDIndicators({ features: features as MACDFeature[] });
        break;
      case "bollingerBands":
        resetBBIndicators({ features: features as BollingerBandsFeature[] });
        break;
      case "dema":
        resetDEMAIndicators({ features: features as DEMAFeature[] });
        break;
      case "rsi":
        resetRSIIndicators({ features: features as RSIFeature[] });
        break;
      case "kdj":
        resetKDJIndicators({ features: features as KDJFeature[] });
        break;
    }
  };
};

export { getHoverPlotFn, getLeavePlotFn };
