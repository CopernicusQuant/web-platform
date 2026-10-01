import type { PriceMomentumFeature } from "@/apis/stock";
import { plotWidthAtom } from "@/atoms/stocks";
import { useAtomValue } from "jotai";
import MABias from "@/components/plot/price-momentum/MABias";

type PMFeature = {
  features: PriceMomentumFeature[];
  x: d3.ScaleBand<string>;
  subplotName: string;
};

export default function PMFeature({ features, x, subplotName }: PMFeature) {
  const width = useAtomValue(plotWidthAtom);
  if (!features) return <></>;
  switch (subplotName) {
    case "MA Bias":
      return <MABias features={features} x={x} width={width} />;
    default:
      return <></>;
  }
}
