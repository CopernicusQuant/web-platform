import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const parseDate = (tradeDate: string): Array<string> => {
  const year = tradeDate.slice(0, 4);
  const month = tradeDate.slice(4, 6);
  const day = tradeDate.slice(-2);
  return [year, month, day];
};

const parseVolume = (volume: number): string => {
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  } else {
    return `${(volume / 1_000).toFixed(2)}K`;
  }
};

const computePriceChange = (
  startPrice: number | undefined,
  endPrice: number | undefined,
) => {
  if (startPrice === undefined || endPrice === undefined) {
    return "0%";
  }
  const pctChange = ((endPrice - startPrice) / Math.max(startPrice, 0.01)) * 100;
  return `${pctChange.toFixed(2)}%`;
};

const getMonthName = (monthStr: string): string => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIdx = Number(monthStr) - 1;
  return monthNames[monthIdx];
};

export { cn, parseDate, getMonthName, parseVolume, computePriceChange };
