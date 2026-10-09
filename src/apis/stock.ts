import { DATA_URL, type DataServiceError } from "@/apis/shared";
import type { FeatureByGroup, FeatureGroupOpt, DataWindowOpt } from "./schema";
import { z } from "zod";
import {
  dataWindowParam,
  featureGroupParam,
  FeatureSchemas,
  StockValuesSchema,
} from "./schema";

const createStockSchema = <G extends FeatureGroupOpt>(group: G) =>
  z
    .object({
      ts_code: z.string(),
      stock: z.array(StockValuesSchema),
      features: z.array(FeatureSchemas[group]),
    })
    .transform(({ ts_code, ...data }) => ({
      ticker: ts_code,
      ...data,
    }));

const getStockData = async (
  ticker: string,
  window: DataWindowOpt,
  featureGroup: FeatureGroupOpt = "priceMomentum",
  signal?: AbortSignal,
) => {
  const url = new URL(
    `stock/${ticker}?window=${dataWindowParam[window]}&group=${featureGroupParam[featureGroup]}`,
    DATA_URL,
  );
  const response = await fetch(url, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as DataServiceError;
    const errorMessage =
      errorData.detail ||
      `failed to get stock data for ${ticker}. Status: ${response.status}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();
  const StockDataSchema = createStockSchema(featureGroup);
  const parsedResult = StockDataSchema.safeParse(responseData.data);
  if (parsedResult.success) {
    return parsedResult.data;
  }
  throw new Error(parsedResult.error.message);
};

export { getStockData };
export type { FeatureByGroup };
