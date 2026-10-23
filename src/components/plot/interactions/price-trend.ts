import * as d3 from "d3";
import { parseVolume, computePriceChange, parseDate, getMonthName } from "@/lib/utils";
import type { StockPrice } from "@/apis";
import { animationConfig, priceColors } from "../theme";
import { toggleElement, updateTextValue } from "./d3-utils";

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
  volumeBarGroup: "price-vol_group",
  volumeLegend: "price-vol-legend",
  volumeLegendValue: "price-vol-legend-val",
};

// update the vertical date line
const updateDateLine = (show: boolean, date?: string, xPos?: number) => {
  const { duration } = animationConfig;
  const { indicatorDateGroup, indicatorGroup, indicatorDay, indicatorMonth } =
    priceElementIds;
  d3.select(`#${indicatorGroup}`).attr("opacity", show ? 1 : 0);
  if (!show || !date) return;
  const dateElements = parseDate(date);
  // update line position
  d3.select(`#${indicatorGroup}`)
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr("transform", `translate(${xPos} 0)`);
  // update date value
  const dateGroup = d3.select(`#${indicatorDateGroup}`);
  dateGroup.select(`#${indicatorDay}`).text(dateElements[2]);
  dateGroup.select(`#${indicatorMonth}`).text(getMonthName(dateElements[1]));
};

// update hover tag's position, value, and color (tag on Y axis)
const updateHoverValueTag = (
  stock: StockPrice[],
  xIdx: number,
  y: d3.ScaleLinear<number, number>,
  width: number,
  marginRight: number,
) => {
  const currClose = stock.at(xIdx)!["adjClose"];
  const beginClose = stock.at(0)!["adjClose"];
  const currPriceGroup = d3
    .transition()
    .duration(50)
    .ease(d3.easeLinear)
    .select(`#${priceElementIds.valuesCurrGroup}`)
    .attr("transform", `translate(${width - marginRight} ${y(currClose)})`);
  currPriceGroup
    .select("rect")
    .attr("fill", currClose >= beginClose ? priceColors.up : priceColors.down);
  currPriceGroup.select("text").text(`${currClose.toFixed(2)}`);
};

// update stock display values (V, L, H, C, O)
const updateDisplayValues = (StockPrice: StockPrice, priceChangePct: string) => {
  const { adjClose, adjOpen, adjHigh, adjLow, adjVol } = StockPrice;
  updateTextValue(priceElementIds.valuesClose, adjClose.toFixed(2));
  updateTextValue(priceElementIds.valuesOpen, adjOpen.toFixed(2));
  updateTextValue(priceElementIds.valuesHigh, adjHigh.toFixed(2));
  updateTextValue(priceElementIds.valuesLow, adjLow.toFixed(2));
  updateTextValue(priceElementIds.valuesVol, parseVolume(adjVol));
  updateTextValue(priceElementIds.valuesPctChange, priceChangePct);
};

// update volume legend
const updateVolumeLegend = (StockPrice: StockPrice) => {
  const { adjClose, adjOpen } = StockPrice;
  const volumeLegend = d3.select(`#${priceElementIds.volumeLegend}`);
  if (!volumeLegend.empty()) {
    const volumeColor = adjClose >= adjOpen ? priceColors.up : priceColors.down;
    volumeLegend.select("rect").attr("stroke", volumeColor);
    volumeLegend.select("text").attr("fill", volumeColor);
  }
};

const updatePriceTrendIndicators = ({
  prices,
  xIdx,
  width,
  marginRight,
  x,
  y,
}: {
  prices: StockPrice[];
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
  const { tradeDate, adjClose } = prices[xIdx];
  const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
  const yPos = y(adjClose) ?? 0;
  const circle = d3.select(`#${priceElementIds.indicatorPoint}`);
  circle.transition().duration(50).ease(d3.easeLinear).attr("cy", yPos);
  d3.select(`#${priceElementIds.valuesPctRect}`).attr(
    "fill",
    adjClose >= prices[0].adjClose ? priceColors.up : priceColors.down,
  );
  updateDateLine(true, tradeDate, xPos);
  updateDisplayValues(prices[xIdx], computePriceChange(prices.at(0)!.adjClose, adjClose));
  updateHoverValueTag(prices, xIdx, y, width, marginRight);
  updateVolumeLegend(prices[xIdx]);
};

const resetPriceTrendIndicators = ({
  prices,
  width,
  marginRight,
  y,
}: {
  prices: StockPrice[];
  width: number;
  marginRight: number;
  y: d3.ScaleLinear<number, number>;
}) => {
  const lastestStock = prices.at(-1);
  if (!lastestStock) return;
  const { adjClose } = lastestStock;
  d3.select(`#${priceElementIds.valuesPctRect}`).attr(
    "fill",
    adjClose > prices[0].adjClose ? priceColors.up : priceColors.down,
  );
  updateDateLine(false);
  updateHoverValueTag(prices, -1, y, width, marginRight);
  updateDisplayValues(lastestStock, computePriceChange(prices.at(0)!.adjClose, adjClose));
  updateVolumeLegend(lastestStock);
};

const toggleVolumeGroup = () => {
  toggleElement(priceElementIds.volumeBarGroup);
  toggleElement(priceElementIds.volumeLegend, 0.3, 1.0);
};

export {
  priceElementIds,
  updatePriceTrendIndicators,
  resetPriceTrendIndicators,
  toggleVolumeGroup,
};
