import type { PriceMomentumFeature } from "@/apis";

type PMSubplotProps = {
  features: PriceMomentumFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { PMSubplotProps };
