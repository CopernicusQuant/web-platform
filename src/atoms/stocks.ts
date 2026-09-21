import type { DataWindowOpt } from "@/apis/stock";
import { atom } from "jotai";

type StockSelection = {
  ticker: string;
  window: DataWindowOpt;
};
const initSelection: StockSelection = {
  ticker: "AAPL",
  window: "60D",
};

const stockSelectionAtom = atom<StockSelection>(initSelection);

export { stockSelectionAtom };
