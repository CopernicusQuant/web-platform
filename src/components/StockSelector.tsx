import { Content, Portal, Root, Trigger } from "@radix-ui/react-popover";
import SearchIcon from "@/components/icons/SearchIcon";
import { useGetStockListQuery } from "@/hooks/queries/useGetStockListQuery";
import { useState } from "react";
import { useSetAtom } from "jotai";
import { stockSelectionAtom } from "@/atoms/stocks";
import clsx from "clsx";

const styles = {
  content: clsx(
    "origin-top flex flex-col gap-3 mt-1 h-96 rounded-md bg-white shadow-[0_2px_8px] border-gray-300 border shadow-gray-300 px-4 py-3 data-[state=open]:animate-[slideUp_200ms_ease-out] w-(--radix-popper-anchor-width)",
  ),
};

export default function StockSelector({
  children,
}: React.ComponentPropsWithoutRef<"div">) {
  const [stockPrefix, setStockPrefix] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const setStockSelection = useSetAtom(stockSelectionAtom);
  const { data: stockList } = useGetStockListQuery();

  const updateStockPrefix = (
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    setStockPrefix(event.target.value.toUpperCase());
  };

  const filteredList = stockList?.filter((stock) => stock[0].startsWith(stockPrefix));

  return (
    <Root onOpenChange={setOpen} open={open}>
      <Trigger asChild>{children}</Trigger>
      <Portal>
        <Content side="bottom" align="center" className={styles.content}>
          <div className="w-full flex items-center border gap-1 border-gray-300 rounded-sm px-2">
            <SearchIcon className="w-4" stroke="gray" />
            <input
              name={"stock search"}
              onChange={updateStockPrefix}
              className="py-1 px-2 focus-visible:outline-0"
            />
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-thin">
            {filteredList?.map((stock) => {
              return (
                <button
                  key={stock.join("-")}
                  className="flex gap-2 items-center p-1 hover:cursor-pointer hover:bg-gray-100 w-full rounded-md"
                  onClick={() => {
                    setStockSelection((prev) => ({ ...prev, ticker: stock[0] }));
                    setOpen(false);
                  }}
                >
                  <p className="text-sm">{stock[0]}</p>
                  <p className="text-sm text-gray-400 text-left">{stock[1]}</p>
                </button>
              );
            })}
          </div>
        </Content>
      </Portal>
    </Root>
  );
}
