import type { MarketActivityFeature } from "@/apis/stock";

type MarketSubplotProps = {
  features: MarketActivityFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { MarketSubplotProps };
