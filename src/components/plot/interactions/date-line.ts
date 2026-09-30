import * as d3 from "d3";
import { animationConfig } from "../theme";
import { parseDate, getMonthName } from "@/lib/utils";

const updateDateLine = ({
  date,
  xPos,
  groupId,
  dateGroupId,
  dayId,
  monthId,
}: {
  date: string;
  xPos: number;
  groupId: string;
  dateGroupId: string;
  dayId: string;
  monthId: string;
}) => {
  const { duration } = animationConfig;
  const dateElements = parseDate(date);
  // update indicator group position
  d3.select(`#${groupId}`)
    .transition()
    .duration(duration)
    .ease(d3.easeLinear)
    .attr("transform", `translate(${xPos} 0)`);
  // update date value
  const dateGroup = d3.select(`#${dateGroupId}`);
  dateGroup.select(`#${dayId}`).text(dateElements[2]);
  dateGroup.select(`#${monthId}`).text(getMonthName(dateElements[1]));
};

export { updateDateLine };
