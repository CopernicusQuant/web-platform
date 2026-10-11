import type { BBSubplotProps } from "./shared";
import BBPosition from "./BBPosition";
import BBWidth from "./BBWidth";

type BBFeaturePlotProps = {
  subplotName: string;
} & BBSubplotProps;

export default function BBFeaturePlot({
  features,
  subplotName,
  width,
  height,
  x,
}: BBFeaturePlotProps) {
  const props: BBSubplotProps = {
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
