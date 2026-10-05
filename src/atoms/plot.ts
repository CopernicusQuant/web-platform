import { atom } from "jotai";

type PlotConfig = {
  referenceHeight: number;
};

const initPlotConfig: PlotConfig = {
  referenceHeight: 0,
};

const plotConfigAtom = atom<PlotConfig>(initPlotConfig);

export { plotConfigAtom };
