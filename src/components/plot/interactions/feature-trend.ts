import * as d3 from "d3";
import type { StockPrice } from "@/apis";
import { animationConfig } from "@plot/theme";
import { getMonthName, parseDate } from "@/lib/utils";

const featureElementIds = {
  indicatorGroup: "features-indicator-group",
  indicatorDateGroup: "features-indicator-date",
  indicatorDay: "features-indicator-day",
  indicatorMonth: "features-indicator-month",
};

// update the vertical date line
const updateDateLine = (show: boolean, date?: string, xPos?: number) => {
  const { duration } = animationConfig;
  const { indicatorDateGroup, indicatorGroup, indicatorDay, indicatorMonth } =
    featureElementIds;
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

const updateFeatureTrendIndicators = ({
  prices,
  xIdx,
  x,
}: {
  prices: StockPrice[];
  xIdx: number;
  x: d3.ScaleBand<string>;
}) => {
  d3.select(`#${featureElementIds.indicatorGroup}`).attr("opacity", 1);
  const { tradeDate } = prices[xIdx];
  const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
  updateDateLine(true, tradeDate, xPos);
};

const resetFeatureTrendIndicators = () => {
  updateDateLine(false);
};

export { featureElementIds, updateFeatureTrendIndicators, resetFeatureTrendIndicators };
