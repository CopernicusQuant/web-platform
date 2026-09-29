import type { DataWindowOpt, FeatureGroupOpt } from "@/apis/stock";
import { atom } from "jotai";

type StockSelection = {
  ticker: string;
  window: DataWindowOpt;
  featureGroup: FeatureGroupOpt;
};

const initSelection: StockSelection = {
  ticker: "AAPL",
  window: "60D",
  featureGroup: "priceMomentum",
};
const stockSelectionAtom = atom<StockSelection>(initSelection);

type PriceChartType = "candle" | "line";
const priceChartTypeAtom = atom<PriceChartType>("candle");

const plotWidthAtom = atom<number>(0);

export { stockSelectionAtom, priceChartTypeAtom, plotWidthAtom };
export type { PriceChartType };
