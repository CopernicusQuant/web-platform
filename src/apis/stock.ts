import { DATA_URL, type DataServiceError } from "@/apis/shared";
import { z } from "zod";

type DataWindowOpt = "60D" | "180D" | "1Y" | "3Y" | "All";

const dataWindow: Record<DataWindowOpt, string> = {
  "60D": "60days",
  "180D": "180days",
  "1Y": "1year",
  "3Y": "3years",
  All: "all",
};

const StockPriceSchema = z
  .object({
    ts_code: z.string(),
    trade_date: z.string(),
    adj_open: z.float32(),
    adj_close: z.float32(),
    adj_high: z.float32(),
    adj_low: z.float32(),
    adj_vol: z.float32(),
  })
  .transform((input) => ({
    ticker: input.ts_code,
    tradeDate: input.trade_date,
    adjOpen: input.adj_open,
    adjClose: input.adj_close,
    adjHigh: input.adj_high,
    adjLow: input.adj_low,
    adjVol: input.adj_vol,
  }));

const PriceMomentumFeaturesSchema = z
  .object({
    ts_code: z.string(),
    trade_date: z.string(),
    ma_5: z.float32(),
    ma_10: z.float32(),
    ma_20: z.float32(),
    ma_60: z.float32(),
  })
  .transform((input) => ({
    ticker: input.ts_code,
    tradeDate: input.trade_date,
    ma5: input.ma_5,
    ma10: input.ma_10,
    ma20: input.ma_20,
    ma60: input.ma_60,
  }));

const VolumeMomentumFeaturesSchema = z
  .object({
    ts_code: z.string(),
    trade_date: z.string(),
  })
  .transform((input) => ({
    ticker: input.ts_code,
    tradeDate: input.trade_date,
  }));

type FeatureGroupOpt = "priceMomentum" | "volumeMomentum";
const FeatureSchemas = {
  priceMomentum: PriceMomentumFeaturesSchema,
  volumeMomentum: VolumeMomentumFeaturesSchema,
} satisfies Record<FeatureGroupOpt, z.ZodType>;
type FeatureByGroup = {
  priceMomentum: z.infer<typeof PriceMomentumFeaturesSchema>;
  volumeMomentum: z.infer<typeof VolumeMomentumFeaturesSchema>;
};

const createStockSchema = <G extends FeatureGroupOpt>(group: G) =>
  z
    .object({
      ts_code: z.string(),
      stock: z.array(StockPriceSchema),
      features: z.array(FeatureSchemas[group]),
    })
    .transform(({ ts_code, ...data }) => ({
      ticker: ts_code,
      ...data,
    }));

type StockPrice = z.infer<typeof StockPriceSchema>;
type StockData<G extends FeatureGroupOpt> = {
  ticker: string;
  stock: StockPrice[];
  features: FeatureByGroup[G][];
};

const getStockData = async (
  ticker: string,
  window: DataWindowOpt,
  featureGroup: FeatureGroupOpt = "priceMomentum",
  signal?: AbortSignal,
) => {
  const url = new URL(`stock/${ticker}?window=${dataWindow[window]}`, DATA_URL);
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

export { getStockData, dataWindow };
export type { DataWindowOpt, StockPrice, StockData, FeatureGroupOpt, FeatureByGroup };
