import { FeatureSubplots, type DataWindowOpt, type FeatureGroupOpt } from "@/apis/stock";
import { atom } from "jotai";

type StockSelection = {
  ticker: string;
  window: DataWindowOpt;
  featureGroup: FeatureGroupOpt;
  featureSubPlot: string;
};

const initSelection: StockSelection = {
  ticker: "AAPL",
  window: "60D",
  featureGroup: "priceMomentum",
  featureSubPlot: FeatureSubplots["priceMomentum"][0],
};

const stockSelectionAtom = atom<StockSelection>(initSelection);

// atomized update methods for the stockSelectionAtom
const setTickerAtom = atom(null, (get, set, update: string) => {
  const { ticker } = get(stockSelectionAtom);
  if (update === ticker) return;
  set(stockSelectionAtom, (prev) => ({ ...prev, ticker: update }));
});

const setFeatureGroupAtom = atom(null, (get, set, update: FeatureGroupOpt) => {
  const { featureGroup } = get(stockSelectionAtom);
  if (update === featureGroup) return;
  set(stockSelectionAtom, (prev) => ({
    ...prev,
    featureGroup: update,
    featureSubPlot: FeatureSubplots[update][0],
  }));
});

const setFeatureSubplotAtom = atom(null, (get, set, update: string) => {
  const { featureSubPlot } = get(stockSelectionAtom);
  if (update === featureSubPlot) return;
  set(stockSelectionAtom, (prev) => ({ ...prev, featureSubPlot: update }));
});

const setStockWindowAtom = atom(null, (get, set, update: DataWindowOpt) => {
  const { window } = get(stockSelectionAtom);
  if (window === update) return;
  set(stockSelectionAtom, (prev) => ({ ...prev, window: update }));
});

type PriceChartType = "candle" | "line";
const priceChartTypeAtom = atom<PriceChartType>("candle");

export {
  stockSelectionAtom,
  priceChartTypeAtom,
  setTickerAtom,
  setFeatureGroupAtom,
  setFeatureSubplotAtom,
  setStockWindowAtom,
};
export type { PriceChartType };
