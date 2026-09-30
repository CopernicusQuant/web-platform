import * as d3 from "d3";
import { parseVolume, computePriceChange } from "@/lib/utils";
import type { StockPrice } from "@/apis/stock";
import { priceColors } from "../theme";
import { updateDateLine } from "./date-line";

const priceElementIds = {
  indicatorGroup: "price-indicator-group",
  indicatorPoint: "price-indicator-point",
  indicatorDateGroup: "price-indicator-date",
  indicatorDay: "price-indicator-day",
  indicatorMonth: "price-indicator-month",
  valuesOpen: "price-values-open",
  valuesClose: "price-values-close",
  valuesHigh: "price-values-high",
  valuesLow: "price-values-low",
  valuesVol: "price-values-vol",
  valuesPctChange: "price-pct-change",
  valuesPctRect: "price-pct-rect",
  valuesCurrGroup: "price-curr-group",
  valuesCurrRect: "price-curr-rect",
  valuesCurrVal: "price-curr-val",
};

const updatePriceTrendIndicators = ({
  stock,
  xIdx,
  width,
  marginRight,
  x,
  y,
}: {
  stock: StockPrice[];
  pointerPos: number;
  xIdx: number;
  width: number;
  height: number;
  marginRight: number;
  marginBottom: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const indicatorGroup = d3.select(`#${priceElementIds.indicatorGroup}`);
  indicatorGroup.attr("opacity", 1);
  const { tradeDate, adjClose, adjOpen, adjHigh, adjLow, adjVol } = stock[xIdx];
  const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
  const yPos = y(adjClose) ?? 0;
  updateDateLine({
    date: tradeDate,
    xPos,
    groupId: priceElementIds.indicatorGroup,
    dateGroupId: priceElementIds.indicatorDateGroup,
    dayId: priceElementIds.indicatorDay,
    monthId: priceElementIds.indicatorMonth,
  });
  const circle = indicatorGroup.select(`#${priceElementIds.indicatorPoint}`);
  circle.transition().duration(50).ease(d3.easeLinear).attr("cy", yPos);
  d3.select(`#${priceElementIds.valuesClose}`).text(`${adjClose.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesOpen}`).text(`${adjOpen.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesHigh}`).text(`${adjHigh.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesLow}`).text(`${adjLow.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesPctChange}`).text(
    `${computePriceChange(stock.at(0)?.adjClose, adjClose)}`,
  );
  d3.select(`#${priceElementIds.valuesVol}`).text(`${parseVolume(adjVol)}`);
  d3.select(`#${priceElementIds.valuesPctRect}`).attr(
    "fill",
    adjClose >= stock[0].adjClose ? priceColors.up : priceColors.down,
  );

  const currPriceGroup = d3
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .select(`#${priceElementIds.valuesCurrGroup}`)
    .attr("transform", `translate(${width - marginRight} ${y(adjClose)})`);
  currPriceGroup
    .select("rect")
    .attr("fill", adjClose > stock[0].adjClose ? priceColors.up : priceColors.down);
  currPriceGroup.select("text").text(`${adjClose.toFixed(2)}`);
};

const resetPriceTrendIndicators = ({
  stock,
  width,
  marginRight,
  y,
}: {
  stock: StockPrice[];
  width: number;
  marginRight: number;
  y: d3.ScaleLinear<number, number>;
}) => {
  const indicatorGroup = d3.select(`#${priceElementIds.indicatorGroup}`);
  indicatorGroup.attr("opacity", 0);
  const lastestStock = stock.at(-1);
  if (!lastestStock) return;
  const { adjClose, adjOpen, adjHigh, adjLow, adjVol } = stock.at(-1)!;
  d3.select(`#${priceElementIds.valuesClose}`).text(`${adjClose.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesOpen}`).text(`${adjOpen.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesHigh}`).text(`${adjHigh.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesLow}`).text(`${adjLow.toFixed(2)}`);
  d3.select(`#${priceElementIds.valuesPctChange}`).text(
    `${computePriceChange(stock.at(0)?.adjClose, stock.at(-1)?.adjClose)}`,
  );
  d3.select(`#${priceElementIds.valuesVol}`).text(`${parseVolume(adjVol)}`);
  d3.select(`#${priceElementIds.valuesPctRect}`).attr(
    "fill",
    adjClose > stock[0].adjClose ? priceColors.up : priceColors.down,
  );
  const currPriceGroup = d3
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .select(`#${priceElementIds.valuesCurrGroup}`)
    .attr("transform", `translate(${width - marginRight} ${y(adjClose)})`);
  currPriceGroup
    .select("rect")
    .attr("fill", adjClose > stock[0].adjClose ? priceColors.up : priceColors.down);
  currPriceGroup.select("text").text(`${adjClose.toFixed(2)}`);
};

export { priceElementIds, updatePriceTrendIndicators, resetPriceTrendIndicators };
