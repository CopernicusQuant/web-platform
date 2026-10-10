import { z } from "zod";

type DataWindowOpt = "60D" | "180D" | "1Y" | "3Y" | "5Y";

const FeatureGroups = ["priceMomentum", "marketActivity", "macd"] as const;
type FeatureGroupOpt = (typeof FeatureGroups)[number];

const featureGroupParam: Record<FeatureGroupOpt, string> = {
  priceMomentum: "pricemomentum",
  marketActivity: "marketactivity",
  macd: "macd",
};

const FeatureSubplots: Record<FeatureGroupOpt, string[]> = {
  priceMomentum: ["maBias", "return", "upDayRatio"] as const,
  marketActivity: ["activityScores", "priceAndTurnover", "amplitude"] as const,
  macd: ["acceleration"] as const,
};

const dataWindowParam: Record<DataWindowOpt, string> = {
  "60D": "60days",
  "180D": "180days",
  "1Y": "1year",
  "3Y": "3years",
  "5Y": "5years",
};

const StockValuesSchema = z
  .object({
    ts_code: z.string(),
    trade_date: z.string(),
    adj_open: z.float32(),
    adj_close: z.float32(),
    adj_high: z.float32(),
    adj_low: z.float32(),
    adj_vol: z.float32(),
    turnover: z.float32(),
  })
  .transform((input) => ({
    ticker: input.ts_code,
    tradeDate: input.trade_date,
    adjOpen: input.adj_open,
    adjClose: input.adj_close,
    adjHigh: input.adj_high,
    adjLow: input.adj_low,
    adjVol: input.adj_vol,
    turnover: input.turnover,
  }));

const PriceMomentumFeaturesSchema = z
  .object({
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

const MarketActivityFeaturesSchema = z
  .object({
    trade_date: z.string(),
    amplitude: z.float32(),
    amplitude_ma_5: z.float32(),
    amplitude_ma_20: z.float32(),
    activity_score_60: z.float32(),
    thin_trade_amplitude_score_60: z.float32(),
    turnover_without_move_score_60: z.float32(),
    amplitude_quantile_60: z.float32(),
    turnover_quantile_60: z.float32(),
  })
  .transform((input) => ({
    tradeDate: input.trade_date,
    amplitude: input.amplitude,
    amplitudeMa5: input.amplitude_ma_5,
    amplitudeMa20: input.amplitude_ma_20,
    tradingActivityScore: input.activity_score_60,
    lowLiquidityVolatilityScore: input.thin_trade_amplitude_score_60,
    stagnantTurnoverScore: input.turnover_without_move_score_60,
    amplitudeQuantile: input.amplitude_quantile_60,
    turnoverQuantile: input.turnover_quantile_60,
  }));

const MACDFeatureSchema = z
  .object({
    trade_date: z.string(),
    macd_ema_slow: z.float32(),
    macd_ema_fast: z.float32(),
    macd_diff: z.float32(),
    macd_dea: z.float32(),
    macd_hist: z.float32(),
    macd_gold: z.int32(),
    macd_dead: z.int32(),
  })
  .transform((input) => ({
    tradeDate: input.trade_date,
    emaSlow: input.macd_ema_slow,
    emaFast: input.macd_ema_fast,
    diff: input.macd_diff,
    hist: input.macd_hist,
    dea: input.macd_dea,
    gold: input.macd_gold,
    dead: input.macd_dead,
  }));

const FeatureSchemas = {
  priceMomentum: PriceMomentumFeaturesSchema,
  marketActivity: MarketActivityFeaturesSchema,
  macd: MACDFeatureSchema,
} satisfies Record<FeatureGroupOpt, z.ZodType>;

type StockValues = z.infer<typeof StockValuesSchema>;
type PriceMomentumFeature = z.infer<typeof PriceMomentumFeaturesSchema>;
type MarketActivityFeature = z.infer<typeof MarketActivityFeaturesSchema>;
type MACDFeature = z.infer<typeof MACDFeatureSchema>;
type FeatureByGroup = {
  priceMomentum: PriceMomentumFeature;
  marketActivity: MarketActivityFeature;
  macd: MACDFeature;
};
type StockData<G extends FeatureGroupOpt> = {
  ticker: string;
  stock: StockValues[];
  features: FeatureByGroup[G][];
};

export {
  dataWindowParam,
  featureGroupParam,
  FeatureGroups,
  StockValuesSchema,
  MarketActivityFeaturesSchema,
  PriceMomentumFeaturesSchema,
  FeatureSchemas,
  FeatureSubplots,
};
export type {
  DataWindowOpt,
  StockData,
  StockValues,
  FeatureGroupOpt,
  FeatureByGroup,
  MACDFeature,
  PriceMomentumFeature,
  MarketActivityFeature,
};
