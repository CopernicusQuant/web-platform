import { DEMAPeriods, type DEMAPeriodOpt } from "@/apis";
import { atom } from "jotai";

type PlotConfig = {
  referenceHeight: number;
};

const initPlotConfig: PlotConfig = {
  referenceHeight: 0,
};

const plotConfigAtom = atom<PlotConfig>(initPlotConfig);

const demaPeriodAtom = atom<DEMAPeriodOpt>(DEMAPeriods[0]);

export { plotConfigAtom, demaPeriodAtom };
