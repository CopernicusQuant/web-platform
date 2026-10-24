import type { SubplotProps } from "@/components/stocks/shared";
import BBPosition from "./BBPosition";
import BBWidth from "./BBWidth";

type BBFeaturePlotProps = {
  subplotName: string;
} & SubplotProps<"bollingerbands">;

export default function BBFeaturePlot({
  features,
  subplotName,
  width,
  height,
  x,
}: BBFeaturePlotProps) {
  const props: SubplotProps<"bollingerbands"> = {
    features,
    x,
    width,
    height,
  };
  if (!features) return <></>;
  switch (subplotName) {
    case "position":
      return <BBPosition {...props} />;
    case "width":
      return <BBWidth {...props} />;
    default:
      <></>;
  }
}
