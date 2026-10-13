import MABias from "@plot/price-momentum/MABias";
import Returns from "@plot/price-momentum/Returns";
import UpDayRatio from "@plot/price-momentum/UpDayRatio";
import type { SubplotProps } from "@plot/shared";

type PMFeatureProps = {
  subplotName: string;
} & SubplotProps<"priceMomentum">;

export default function PMFeature({
  features,
  width,
  height,
  x,
  subplotName,
}: PMFeatureProps) {
  const props: SubplotProps<"priceMomentum"> = {
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
