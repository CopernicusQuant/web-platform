import type { MACDFeature } from "@/apis";

type MACDSubplotProps = {
  features: MACDFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { MACDSubplotProps };
