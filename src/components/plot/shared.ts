import type { FeatureByGroup, FeatureGroupOpt } from "@/apis";

type SubplotProps<G extends FeatureGroupOpt> = {
  features: FeatureByGroup[G][];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
};

export type { SubplotProps };
