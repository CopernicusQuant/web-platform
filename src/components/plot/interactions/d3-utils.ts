import * as d3 from "d3";

const updateTextValue = (id: string, text: string) => {
  d3.select(`#${id}`).text(text);
};

const toggleElement = (
  id: string,
  hiddenOpacity: number = 0,
  visibleOpacity: number = 1.0,
) => {
  // const { duration } = animationConfig;
  const element = d3.select(`#${id}`);
  if (element.empty()) return;
  const currState = element.attr("data-on") ?? "on";
  if (currState === "on") {
    element.attr("opacity", Math.max(0.0, hiddenOpacity));
  } else {
    element.attr("opacity", Math.min(1.0, visibleOpacity));
  }
  element.attr("data-on", currState === "on" ? "off" : "on");
};

export { updateTextValue, toggleElement };
