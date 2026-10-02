import { DATA_URL, type DataServiceError } from "@/apis/shared";
import { z } from "zod";

type DataWindowOpt = "60D" | "180D" | "1Y" | "3Y" | "5Y";

const dataWindow: Record<DataWindowOpt, string> = {
  "60D": "60days",
  "180D": "180days",
  "1Y": "1year",
  "3Y": "3years",
  "5Y": "5years",
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
    // ma_10: z.float32(),
    ma_20: z.float32(),
    ma_60: z.float32(),
    ma_5_bias: z.float32(),
    ma_20_bias: z.float32(),
    ma_60_bias: z.float32(),
    return_5d: z.float32(),
    return_20d: z.float32(),
    return_60d: z.float32(),
    up_ratio_5d: z.float32(),
    up_ratio_20d: z.float32(),
  })
  .transform((input) => ({
    ticker: input.ts_code,
    tradeDate: input.trade_date,
    ma5: input.ma_5,
    // ma10: input.ma_10,
    ma20: input.ma_20,
    ma60: input.ma_60,
    ma5Bias: input.ma_5_bias,
    ma20Bias: input.ma_20_bias,
    ma60Bias: input.ma_60_bias,
    return5d: input.return_5d,
    return20d: input.return_20d,
    return60d: input.return_60d,
    upRatio5d: input.up_ratio_5d,
    upRatio20d: input.up_ratio_20d,
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
type PriceMomentumFeature = z.infer<typeof PriceMomentumFeaturesSchema>;
type FeatureByGroup = {
  priceMomentum: PriceMomentumFeature;
  volumeMomentum: z.infer<typeof VolumeMomentumFeaturesSchema>;
};
const FeatureSchemas = {
  priceMomentum: PriceMomentumFeaturesSchema,
  volumeMomentum: VolumeMomentumFeaturesSchema,
} satisfies Record<FeatureGroupOpt, z.ZodType>;

const FeatureSubplots: Record<FeatureGroupOpt, string[]> = {
  priceMomentum: ["maBias", "return", "upDayRatio"] as const,
  volumeMomentum: ["maBias"],
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

export { getStockData, dataWindow, FeatureSubplots };
export type {
  DataWindowOpt,
  StockPrice,
  StockData,
  FeatureGroupOpt,
  FeatureByGroup,
  PriceMomentumFeature,
};
