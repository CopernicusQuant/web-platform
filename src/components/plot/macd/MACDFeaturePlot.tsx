import type { MACDSubplotProps } from "./shared";
import Acceleration from "./Acceleration";

type MACDFeatureProps = {} & MACDSubplotProps;

export default function MACDFeaturePlot({
  features,
  x,
  height,
  width,
}: MACDFeatureProps) {
  const props = { features, x, height, width };
  return <Acceleration {...props} />;
}
