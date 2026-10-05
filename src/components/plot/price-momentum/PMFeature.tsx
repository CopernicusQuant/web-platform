import type { PriceMomentumFeature } from "@/apis/stock";
import MABias from "@/components/plot/price-momentum/MABias";
import Returns from "@/components/plot/price-momentum/Returns";
import UpDayRatio from "@/components/plot/price-momentum/UpDayRatio";

type PMFeature = {
  features: PriceMomentumFeature[];
  width: number;
  height: number;
  x: d3.ScaleBand<string>;
  subplotName: string;
};

export default function PMFeature({
  features,
  width,
  height,
  x,
  subplotName,
}: PMFeature) {
  if (!features) return <></>;
  switch (subplotName) {
    case "maBias":
      return <MABias features={features} x={x} width={width} height={height} />;
    case "return":
      return <Returns features={features} x={x} width={width} height={height} />;
    case "upDayRatio":
      return <UpDayRatio features={features} x={x} width={width} height={height} />;
    default:
      return <></>;
  }
}
