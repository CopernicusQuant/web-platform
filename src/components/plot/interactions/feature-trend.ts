import * as d3 from "d3";
import { updateDateLine } from "@/components/plot/interactions/date-line";
import type { StockPrice } from "@/apis/stock";

const featureElementIds = {
  indicatorGroup: "features-indicator-group",
  indicatorDateGroup: "features-indicator-date",
  indicatorDay: "features-indicator-day",
  indicatorMonth: "features-indicator-month",
};

const updateFeatureTrendIndicators = ({
  stock,
  xIdx,
  x,
}: {
  stock: StockPrice[];
  xIdx: number;
  x: d3.ScaleBand<string>;
}) => {
  d3.select(`#${featureElementIds.indicatorGroup}`).attr("opacity", 1);
  const { tradeDate } = stock[xIdx];
  const xPos = (x(tradeDate) ?? 0) + x.bandwidth() / 2;
  updateDateLine({
    date: tradeDate,
    xPos,
    groupId: featureElementIds.indicatorGroup,
    dateGroupId: featureElementIds.indicatorDateGroup,
    dayId: featureElementIds.indicatorDay,
    monthId: featureElementIds.indicatorMonth,
  });
};

const resetFeatureTrendIndicators = () => {
  d3.select(`#${featureElementIds.indicatorGroup}`).attr("opacity", 0);
};

export { featureElementIds, updateFeatureTrendIndicators, resetFeatureTrendIndicators };
