import MABias from "@plot/price-momentum/MABias";
import Returns from "@plot/price-momentum/Returns";
import UpDayRatio from "@plot/price-momentum/UpDayRatio";
import type { PMSubplotProps } from "./shared";

type PMFeatureProps = {
  subplotName: string;
} & PMSubplotProps;

export default function PMFeature({
  features,
  width,
  height,
  x,
  subplotName,
}: PMFeatureProps) {
  const props: PMSubplotProps = {
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
