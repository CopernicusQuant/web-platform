import type { SubplotProps } from "@/components/shared";
import Acceleration from "./Acceleration";

type MACDFeatureProps = {} & SubplotProps<"macd">;

export default function MACDFeaturePlot({
  features,
  x,
  height,
  width,
}: MACDFeatureProps) {
  const props = { features, x, height, width };
  return <Acceleration {...props} />;
}
