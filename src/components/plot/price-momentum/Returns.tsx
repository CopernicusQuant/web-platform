import type { PriceMomentumFeature } from "@/apis/stock";
import * as d3 from "d3";

type ReturnsProps = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
  yAxisMin: number;
  yAxisMax: number;
};

export default function Returns({ features, x }: ReturnsProps) {
  return <g></g>;
}
