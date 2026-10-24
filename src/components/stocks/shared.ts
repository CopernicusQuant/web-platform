import type { FeatureByGroup, FeatureGroupOpt } from "@/apis";

const priceChartTypes = ["candle", "line"] as const;
type PriceChartType = (typeof priceChartTypes)[number];

type SubplotProps<G extends FeatureGroupOpt> = {
  features: FeatureByGroup[G][];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { SubplotProps, PriceChartType };
export { priceChartTypes };
