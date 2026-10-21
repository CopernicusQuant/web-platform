import type { SubplotProps } from "@plot/shared";
import VolatilityLog from "./VolatilityLog";
import VolatilityRank from "./VolatilityRank";

type VolatilityFeaturesProps = { subplotName: string } & SubplotProps<"volatility">;

export default function VolatilityFeaturesPlot({
  features,
  subplotName,
  width,
  height,
  x,
}: VolatilityFeaturesProps) {
  const props: SubplotProps<"volatility"> = { features, width, height, x };
  switch (subplotName) {
    case "logVolatility":
      return <VolatilityLog {...props} />;
    case "volatilityRank":
      return <VolatilityRank {...props} />;
    default:
      return <></>;
  }
}
