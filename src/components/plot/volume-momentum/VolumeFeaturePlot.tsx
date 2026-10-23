import type { SubplotProps } from "@/components/shared";
import VolBias from "./VolBias";
import VolChange from "./VolChange";
import VolMARatio from "./VolMARatio";

type VolumeFeaturePlot = { subplotName: string } & SubplotProps<"volumemomentum">;

export default function VolumeFeaturePlot({
  features,
  x,
  height,
  width,
  subplotName,
}: VolumeFeaturePlot) {
  const props = { features, x, height, width };
  switch (subplotName) {
    case "volumeBias":
      return <VolBias {...props} />;
    case "volumeChanges":
      return <VolChange {...props} />;
    case "volumeMARatio":
      return <VolMARatio {...props} />;
    default:
      return <></>;
  }
}
