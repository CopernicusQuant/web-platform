import MABias from "@/components/plot/price-momentum/MABias";
import Returns from "@/components/plot/price-momentum/Returns";
import UpDayRatio from "@/components/plot/price-momentum/UpDayRatio";
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
