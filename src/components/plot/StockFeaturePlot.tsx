import * as d3 from "d3";
import type { FeatureGroupOpt, StockData } from "@/apis/stock";
import XAxis from "@/components/plot/XAxis";
import MABias from "./price-momentum/MABias";
import type { FeatureByGroup } from "@/apis/stock";

type StockFeaturePlotProps = {
  data: StockData<FeatureGroupOpt>;
  width: number;
  height: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  maxXTickNum?: number;
};

export default function StockFeaturePlot({
  data,
  width,
  height,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 45,
  marginLeft = 0,
  maxXTickNum = 30,
}: StockFeaturePlotProps) {
  const { features } = data;
  const x = d3
    .scaleBand(
      features.map((d) => d.tradeDate),
      [marginLeft, width - marginRight],
    )
    .paddingInner(0.2);
  const xSteps = Math.floor(features.length / maxXTickNum);
  const xLabels = features
    .filter((_, i) => (features.length - 1 - i) % xSteps == 0)
    .map((d) => d.tradeDate);

  return (
    <svg width={width} height={height}>
      <XAxis labels={xLabels} x={x} xPos={0} yPos={height - marginBottom} />
      {features && (
        <MABias
          features={features as FeatureByGroup["priceMomentum"][]}
          width={width}
          height={height}
          x={x}
          marginTop={marginTop}
          marginRight={marginRight}
          marginBottom={marginBottom}
          marginLeft={marginLeft}
        />
      )}
    </svg>
  );
}
