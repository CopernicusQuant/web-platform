import * as d3 from "d3";
import { parseDate, getMonthName, parseVolume, computePriceChange } from "@/lib/utils";
import type { StockPrice } from "@/apis/stock";

const elementIds = {
  indicatorGroup: "price-indicator-group",
  indicatorLine: "price-indicator-line",
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
};

const updatePriceTrendIndicators = ({
  stock,
  xIdx,
  height,
  marginBottom,
  x,
  y,
}: {
  stock: StockPrice[];
  pointerPos: number;
  xIdx: number;
  height: number;
  marginBottom: number;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number>;
}) => {
  const indicatorGroup = d3.select(`#${elementIds.indicatorGroup}`);
  indicatorGroup.attr("opacity", 1);
  const { tradeDate, adjClose, adjOpen, adjHigh, adjLow, adjVol } = stock[xIdx];
  const dateElements = parseDate(tradeDate);
  const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
  const yPos = y(adjClose) ?? 0;
  const line = indicatorGroup.select(`#${elementIds.indicatorLine}`);
  const currDate = indicatorGroup.select(`#${elementIds.indicatorDateGroup}`);
  const circle = indicatorGroup.select(`#${elementIds.indicatorPoint}`);
  line.transition().duration(50).ease(d3.easeLinear).attr("x1", xPos).attr("x2", xPos);
  circle.transition().duration(50).ease(d3.easeLinear).attr("cx", xPos).attr("cy", yPos);
  currDate
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .attr("transform", `translate(${xPos}, ${height - marginBottom})`);
  currDate.select(`#${elementIds.indicatorDay}`).text(dateElements[2]);
  currDate.select(`#${elementIds.indicatorMonth}`).text(getMonthName(dateElements[1]));
  d3.select(`#${elementIds.valuesClose}`).text(`${adjClose.toFixed(2)}`);
  d3.select(`#${elementIds.valuesOpen}`).text(`${adjOpen.toFixed(2)}`);
  d3.select(`#${elementIds.valuesHigh}`).text(`${adjHigh.toFixed(2)}`);
  d3.select(`#${elementIds.valuesLow}`).text(`${adjLow.toFixed(2)}`);
  d3.select(`#${elementIds.valuesPctChange}`).text(
    `${computePriceChange(stock.at(0)?.adjClose, adjClose)}`,
  );
  d3.select(`#${elementIds.valuesVol}`).text(`${parseVolume(adjVol)}`);
};

const resetPriceTrendIndicators = ({ stock }: { stock: StockPrice[] }) => {
  const indicatorGroup = d3.select("#price-indicator-group");
  indicatorGroup.attr("opacity", 0);
  const lastestStock = stock.at(-1);
  if (!lastestStock) return;
  const { adjClose, adjOpen, adjHigh, adjLow, adjVol } = stock.at(-1)!;
  d3.select(`#${elementIds.valuesClose}`).text(`${adjClose.toFixed(2)}`);
  d3.select(`#${elementIds.valuesOpen}`).text(`${adjOpen.toFixed(2)}`);
  d3.select(`#${elementIds.valuesHigh}`).text(`${adjHigh.toFixed(2)}`);
  d3.select(`#${elementIds.valuesLow}`).text(`${adjLow.toFixed(2)}`);
  d3.select(`#${elementIds.valuesPctChange}`).text(
    `${computePriceChange(stock.at(0)?.adjClose, stock.at(-1)?.adjClose)}`,
  );
  d3.select(`#${elementIds.valuesVol}`).text(`${parseVolume(adjVol)}`);
};

export { elementIds, updatePriceTrendIndicators, resetPriceTrendIndicators };
