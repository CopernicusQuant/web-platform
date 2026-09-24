import { stockSelectionAtom } from "@/atoms/stocks";
import { useGetStockInfoQuery } from "@/hooks/queries/useGetStockInfoQuery";
import clsx from "clsx";
import { useAtom } from "jotai";
import { cn } from "@/lib/utils";

const styles = {
  container: clsx(
    "w-full h-20 grid grid-cols-5 items-center border border-gray-300 rounded-md overflow-hidden",
  ),
  columnBasic: clsx(
    "w-full h-full px-8 border-r border-gray-300 flex flex-col justify-center transition duration-100 text-sm",
  ),
  columnButton: clsx(
    "flex-1 hover:cursor-pointer px-4 hover:underline h-full hover:bg-gray-200 transition duration-150",
  ),
  columnDownload: clsx(
    "absolute w-full h-full transition-all duration-150 text-sm flex items-center justify-center",
  ),
  columnDownloadSeparator: clsx("border-r h-full border-gray-300"),
};

export default function StockInfo() {
  const [selection] = useAtom(stockSelectionAtom);
  const { data } = useGetStockInfoQuery(selection.ticker);
  return (
    <div className="w-full">
      <div className={styles.container}>
        {data && (
          <>
            <div className={cn(styles.columnBasic, "cursor-pointer hover:bg-gray-200")}>
              <h2 className="font-semibold text-lg">{data.ticker}</h2>
              <p>{data.companyName}</p>
            </div>
            <div className={cn(styles.columnBasic, "col-span-2")}>
              <p>{data.sector}</p>
              <p>{data.subIndustry}</p>
            </div>
            <div className={styles.columnBasic}>
              <p>founded in {data.founded}</p>
              <p>{data.headquarters}</p>
            </div>
            <div
              className={cn(
                styles.columnBasic,
                "relative group items-center border-none",
              )}
            >
              <div
                className={cn(
                  styles.columnDownload,
                  "group-hover:-translate-y-full group-hover:opacity-0 opacity-100",
                )}
              >
                <p>Download Data</p>
              </div>
              <div
                className={cn(
                  styles.columnDownload,
                  "translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
                )}
              >
                <button className={styles.columnButton}>Stock</button>
                <span className={styles.columnDownloadSeparator}></span>
                <button className={styles.columnButton}>Features</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
