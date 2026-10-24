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
  CCIFeature,
  VolatilityFeature,
} from "@/apis";
import { updatePriceTrendIndicators, resetPriceTrendIndicators } from "./price-trend";
import {
  updateFeatureTrendIndicators,
  resetFeatureTrendIndicators,
} from "@stocks/plot/interactions/feature-trend";
import {
  updatePriceMomentumIndicators,
  resetPriceMomentumIndicators,
} from "@stocks/plot/interactions/price-momentum";
import { plotSizeConfig } from "@/lib/theme";
import {
  resetMarketActivityIndicators,
  updateMarketActivityIndicators,
} from "@stocks/plot/interactions/market-activity";
import {
  resetMACDIndicators,
  updateMACDIndicators,
} from "@stocks/plot/interactions/macd";
import {
  resetBBIndicators,
  updateBBIndicators,
} from "@stocks/plot/interactions/bollinger-bands";
import {
  resetDEMAIndicators,
  updateDEMAIndicators,
} from "@stocks/plot/interactions/dema";
import {
  resetVolumeIndicators,
  updateVolumeIndicators,
} from "@stocks/plot/interactions/volume-momentum";
import { updateRSIIndicators, resetRSIIndicators } from "@stocks/plot/interactions/rsi";
import { resetOBVIndicators, updateOBVIndicators } from "@stocks/plot/interactions/obv";
import { resetKDJIndicators, updateKDJIndicators } from "@stocks/plot/interactions/kdj";
import { resetCCIIndicators, updateCCIIndicators } from "@stocks/plot/interactions/cci";
import { resetVolatilityIndicators, updateVolatilityIndicators } from "./volatility";

const getHoverPlotFn = <G extends FeatureGroupOpt>({
  prices,
  features,
  featureGroup,
  width,
  referenceHeight,
}: {
  prices: StockPrice[] | undefined;
  features: FeatureByGroup[G][] | undefined;
  featureGroup: FeatureGroupOpt;
  width: number;
  referenceHeight: number;
}) => {
  if (!prices) return;
  const { marginBottom, marginTop, marginLeft, marginRight } = plotSizeConfig;
  // x-axis mapper
  const x = d3
    .scaleBand(
      prices.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  // y-axis mapper
  const yMax = d3.max(prices, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(prices, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [referenceHeight - marginBottom, marginTop],
  );

  return (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerPos = event.clientX - rect.x - marginLeft;
    let xIdx = Math.floor(pointerPos / x.step());
    xIdx = Math.max(Math.min(xIdx, prices.length - 1), 0);
    updatePriceTrendIndicators({
      prices,
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
      prices,
      xIdx,
      x,
    });
    if (!features) return;
    switch (featureGroup) {
      case "pricemomentum":
        updatePriceMomentumIndicators({
          xIdx,
          features: features as PriceMomentumFeature[],
          x,
          y,
        });
        break;
      case "volumemomentum":
        updateVolumeIndicators({
          xIdx,
          prices,
          features: features as VolumeMomentumFeature[],
        });
        break;
      case "volatility":
        updateVolatilityIndicators({ features: features as VolatilityFeature[], xIdx });
        break;
      case "obv":
        updateOBVIndicators({ features: features as OBVFeature[], xIdx });
        break;
      case "marketactivity":
        updateMarketActivityIndicators({
          prices,
          features: features as MarketActivityFeature[],
          xIdx,
        });
        break;
      case "macd":
        updateMACDIndicators({ xIdx, features: features as MACDFeature[], x, y });
        break;
      case "bollingerbands":
        updateBBIndicators({ xIdx, features: features as BollingerBandsFeature[], x, y });
        break;
      case "dema":
        updateDEMAIndicators({ xIdx, features: features as DEMAFeature[], x, y });
        break;
      case "rsi":
        updateRSIIndicators({ features: features as RSIFeature[], xIdx });
        break;
      case "kdj":
        updateKDJIndicators({ features: features as KDJFeature[], xIdx, x, y });
        break;
      case "cci":
        updateCCIIndicators({ features: features as CCIFeature[], xIdx, x, y });
        break;
    }
  };
};

const getLeavePlotFn = <G extends FeatureGroupOpt>({
  prices,
  features,
  featureGroup,
  width,
  referenceHeight,
}: {
  prices: StockPrice[] | undefined;
  features: FeatureByGroup[G][] | undefined;
  featureGroup: FeatureGroupOpt;
  width: number;
  referenceHeight: number;
}) => {
  const { marginRight, marginBottom, marginTop } = plotSizeConfig;
  if (!prices) return;
  // y-axis mapper
  const yMax = d3.max(prices, (d) => d.adjHigh) ?? 1;
  const yMin = d3.min(prices, (d) => d.adjLow) ?? 0;
  const yPadding = (yMax - yMin) * 0.05 || 1;
  const y = d3.scaleLinear(
    [yMin - yPadding, yMax + yPadding],
    [referenceHeight - marginBottom, marginTop],
  );
  return () => {
    resetPriceTrendIndicators({ prices, width, marginRight, y });
    resetFeatureTrendIndicators();
    if (!features) return;
    switch (featureGroup) {
      case "pricemomentum":
        resetPriceMomentumIndicators({ features: features as PriceMomentumFeature[] });
        break;
      case "volumemomentum":
        resetVolumeIndicators({ features: features as VolumeMomentumFeature[], prices });
        break;
      case "volatility":
        resetVolatilityIndicators({ features: features as VolatilityFeature[] });
        break;
      case "obv":
        resetOBVIndicators({ features: features as OBVFeature[] });
        break;
      case "marketactivity":
        resetMarketActivityIndicators({
          prices,
          features: features as MarketActivityFeature[],
        });
        break;
      case "macd":
        resetMACDIndicators({ features: features as MACDFeature[] });
        break;
      case "bollingerbands":
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
      case "cci":
        resetCCIIndicators({ features: features as CCIFeature[] });
        break;
    }
  };
};

export { getHoverPlotFn, getLeavePlotFn };
