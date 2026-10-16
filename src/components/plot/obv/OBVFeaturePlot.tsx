import type { SubplotProps } from "@plot/shared";
import OBVPressure from "./OBVPressure";
import OBVMomentum from "./OBVMomentum";

type OBVFeaturePlotProps = { subplotName: string } & SubplotProps<"obv">;

export default function OBVFeaturePlot({
  subplotName,
  features,
  width,
  height,
  x,
}: OBVFeaturePlotProps) {
  const props: SubplotProps<"obv"> = { features, width, height, x };
  switch (subplotName) {
    case "pressure":
      return <OBVPressure {...props} />;
    case "momentum":
      return <OBVMomentum {...props} />;
    default:
      return <></>;
  }
}
