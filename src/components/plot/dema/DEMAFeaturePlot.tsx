import type { SubplotProps } from "@/components/shared";
import DEMASpread from "./DEMASpread";

type DEMAFeaturePlotProps = {} & SubplotProps<"dema">;

export default function DEMAFeaturePlot({
  features,
  width,
  height,
  x,
}: DEMAFeaturePlotProps) {
  const props = { features, width, height, x };
  return <DEMASpread {...props} />;
}
