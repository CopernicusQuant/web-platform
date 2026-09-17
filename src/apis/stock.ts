import { DATA_URL, type DataServiceError } from "@/apis/shared";

type DataWindowOpt = "Days30" | "Days60" | "Year1" | "Years3" | "All";
const DataWindow: Record<DataWindowOpt, string> = {
  Days30: "30days",
  Days60: "60days",
  Year1: "1year",
  Years3: "3years",
  All: "all",
};

const getStockData = async (
  ts_code: string,
  window: DataWindowOpt,
  signal?: AbortSignal,
) => {
  const url = new URL(`stock/${ts_code}?window=${DataWindow[window]}`, DATA_URL);
  const response = await fetch(url, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as DataServiceError;
    const errorMessage =
      errorData.detail ||
      `failed to get stock data for ${ts_code}. Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();
  return responseData;
};

export { DataWindow, getStockData };
