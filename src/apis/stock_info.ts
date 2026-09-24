import z from "zod";
import { DATA_URL, type DataServiceError } from "@/apis/shared";

const StockListSchema = z
  .object({
    ts_code: z.string(),
    company_name: z.string(),
    sector: z.string(),
    sub_industry: z.string(),
    headquarters: z.string(),
    founded: z.string(),
  })
  .transform((input) => ({
    ticker: input.ts_code,
    companyName: input.company_name,
    subIndustry: input.sub_industry,
    sector: input.sector,
    headquarters: input.headquarters,
    founded: input.founded,
  }));

const getStockInfo = async (ticker: string, signal?: AbortSignal) => {
  const url = new URL(`stockinfo?ticker=${ticker}`, DATA_URL);
  const response = await fetch(url, {
    method: "GET",
    signal,
  });
  if (!response.ok) {
    const errorData = (await response.json()) as DataServiceError;
    const errorMessage =
      errorData.detail ||
      `Failed to get stock list from server. Status ${response.status}`;
    throw new Error(errorMessage);
  }
  const responseData = await response.json();
  const parsedResult = StockListSchema.safeParse(responseData.data);
  if (parsedResult.success) {
    return parsedResult.data;
  }
  throw new Error(parsedResult.error.message);
};

export { getStockInfo };
