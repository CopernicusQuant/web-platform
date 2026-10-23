import { DATA_URL, type DataServiceError } from "@/apis/shared";
import type { FeatureGroupOpt, DataWindowOpt } from "./schema";
import { z } from "zod";
import {
  dataWindowParam,
  featureGroupParam,
  FeatureSchemas,
  StockPriceSchema,
} from "./schema";

const StockPriceResponseSchema = z.array(StockPriceSchema);
const getStockFeaturesResponseSchema = <G extends FeatureGroupOpt>(group: G) => {
  return z.array(FeatureSchemas[group]);
};

const getStockPrices = async (
  ticker: string,
  window: DataWindowOpt,
  signal?: AbortSignal,
) => {
  const url = new URL(`data/stock/${ticker}?window=${dataWindowParam[window]}`, DATA_URL);
  const response = await fetch(url, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as DataServiceError;
    const errorMessage =
      errorData.error.message ||
      `failed to get stock data for ${ticker}. Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();
  const parsedResult = StockPriceResponseSchema.safeParse(responseData.data);
  if (parsedResult.success) {
    return parsedResult.data;
  }
  throw new Error(parsedResult.error.message);
};

const getStockFeatures = async (
  ticker: string,
  window: DataWindowOpt,
  featureGroup: FeatureGroupOpt = "pricemomentum",
  signal?: AbortSignal,
) => {
  const url = new URL(
    `data/features/${ticker}?window=${dataWindowParam[window]}&group=${featureGroupParam[featureGroup]}`,
    DATA_URL,
  );
  const response = await fetch(url, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as DataServiceError;
    const errorMessage =
      errorData.error.message ||
      `failed to get stock data for ${ticker}. Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();
  const StockFeaturesResponseSchema = getStockFeaturesResponseSchema(featureGroup);
  const parsedResult = StockFeaturesResponseSchema.safeParse(responseData.data);
  if (parsedResult.success) {
    return parsedResult.data;
  }
  throw new Error(parsedResult.error.message);
};

export { getStockPrices, getStockFeatures };
