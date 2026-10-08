import type { PriceMomentumFeature } from "@/apis/stock";

type PMSubplotProps = {
  features: PriceMomentumFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { PMSubplotProps };
