import ActivityScores from "@plot/market-activity/ActivityScores";
import Amplitude from "@plot/market-activity/Amplitude";
import PriceAndTurnover from "@plot/market-activity/PriceAndTurnover";
import type { MarketSubplotProps } from "@plot/market-activity/shared";

type MarketFeature = {
  subplotName: string;
} & MarketSubplotProps;

export default function MarketFeature({
  features,
  subplotName,
  width,
  height,
  x,
}: MarketFeature) {
  const props: MarketSubplotProps = {
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
