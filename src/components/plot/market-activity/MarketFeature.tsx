import ActivityScores from "./ActivityScores";
import Amplitude from "./Amplitude";
import PriceAndTurnover from "./PriceAndTurnover";
import type { MarketSubplotProps } from "./shared";

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
