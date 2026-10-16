import * as d3 from "d3";
import type { StockValues } from "@/apis";
import { priceColors } from "@plot/theme";
import { getYScale } from "@plot/interactions/d3-utils";
import Legend from "@/components/ui/Legend";
import { useTranslation } from "react-i18next";
import { priceElementIds, toggleVolumeGroup } from "./interactions/price-trend";

type VolumesProps = {
  stock: StockValues[];
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
};

export default function Volumes({ stock, x, y }: VolumesProps) {
  const { t } = useTranslation();
  const volVals = stock.map((values) => values.adjVol);
  const yRange = y.range();
  const yVol = getYScale(volVals, yRange[0], yRange[0] + (yRange[1] - yRange[0]) / 2);
  if (!stock) return <></>;
  const isUp = stock.at(-1)!["adjClose"] >= stock.at(-1)!["adjOpen"];
  return (
    <>
      <g id={priceElementIds.volumeBarGroup}>
        {stock.map(({ tradeDate, adjVol, adjClose, adjOpen }) => (
          <rect
            key={`volume-${tradeDate}`}
            x={x(tradeDate) ?? 0}
            y={yVol(adjVol)}
            width={x.bandwidth()}
            height={yVol.range()[0] - yVol(adjVol)}
            fill={adjClose >= adjOpen ? priceColors.up : priceColors.down}
            opacity={0.4}
          />
        ))}
      </g>
      <Legend
        legendId={priceElementIds.volumeLegend}
        valueId={priceElementIds.volumeLegendValue}
        index={0}
        label={t(`featureName.adjVol`)}
        color={isUp ? priceColors.up : priceColors.down}
        onMouseDown={() => toggleVolumeGroup()}
      />
    </>
  );
}
