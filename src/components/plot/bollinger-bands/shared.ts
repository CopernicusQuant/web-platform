import type { BollingerBandsFeature } from "@/apis";

type BBSubplotProps = {
  features: BollingerBandsFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { BBSubplotProps };
