import * as d3 from "d3";

const updateTextValue = (id: string, text: string) => {
  d3.select(`#${id}`).text(text);
};

export { updateTextValue };
