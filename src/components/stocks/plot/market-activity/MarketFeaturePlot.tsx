import ActivityScores from "@stocks/plot/market-activity/ActivityScores";
import Amplitude from "@stocks/plot/market-activity/Amplitude";
import PriceAndTurnover from "@stocks/plot/market-activity/PriceAndTurnover";
import type { SubplotProps } from "@/components/stocks/shared";

type MarketFeature = {
  subplotName: string;
} & SubplotProps<"marketactivity">;

export default function MarketFeaturePlot({
  features,
  subplotName,
  width,
  height,
  x,
}: MarketFeature) {
  const props: SubplotProps<"marketactivity"> = {
    features,
    x,
    width,
    height,
  };
  if (!features) return <></>;
  switch (subplotName) {
    case "activityScores":
      return <ActivityScores {...props} />;
    case "priceAndTurnover":
      return <PriceAndTurnover {...props} />;
    case "amplitude":
      return <Amplitude {...props} />;
    default:
      return <></>;
  }
}
