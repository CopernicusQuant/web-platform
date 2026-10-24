import MABias from "@stocks/plot/price-momentum/MABias";
import Returns from "@stocks/plot/price-momentum/Returns";
import UpDayRatio from "@stocks/plot/price-momentum/UpDayRatio";
import type { SubplotProps } from "@/components/stocks/shared";

type PMFeatureProps = {
  subplotName: string;
} & SubplotProps<"pricemomentum">;

export default function PMFeature({
  features,
  width,
  height,
  x,
  subplotName,
}: PMFeatureProps) {
  const props: SubplotProps<"pricemomentum"> = {
    features,
    x,
    width,
    height,
  };

  if (!features) return <></>;
  switch (subplotName) {
    case "maBias":
      return <MABias {...props} />;
    case "return":
      return <Returns {...props} />;
    case "upDayRatio":
      return <UpDayRatio {...props} />;
    default:
      return <></>;
  }
}
