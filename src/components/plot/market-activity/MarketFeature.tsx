import * as d3 from "d3";
import type { MarketActivityFeature } from "@/apis/stock";
import ActivityScores from "./ActivityScores";

type MarketFeature = {
  features: MarketActivityFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
  subplotName: string;
};

export default function MarketFeature({
  features,
  subplotName,
  width,
  height,
  x,
}: MarketFeature) {
  if (!features) return <></>;
  switch (subplotName) {
    case "activityScores":
      return <ActivityScores features={features} x={x} width={width} height={height} />;
    default:
      return <></>;
  }
}
