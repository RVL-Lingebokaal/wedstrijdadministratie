import { ReactNode } from "react";
import { colsOptions, getRoundedClass } from "../../utils/gridUtils";
import { twMerge } from "tailwind-merge";

interface Item {
  node: string | ReactNode;
  isInput?: boolean;
  classNames?: string;
}

interface GridRowProps {
  items: Item[];
  lastRow?: boolean;
  classNames?: string;
  itemsCount?: number;
}

export function GridRow({
  items,
  lastRow,
  classNames,
  itemsCount,
}: GridRowProps) {
  return (
    <div
      className={twMerge([
        `grid ${colsOptions[itemsCount ?? items.length]} m-1`,
        classNames,
      ])}
    >
      {items.map(({ node, isInput, classNames }, index) => (
        <div
          key={index}
          className={twMerge(
            `bg-white ${isInput ? "py-1.5" : "py-3"} px-4 ${
              lastRow ? getRoundedClass(index, items.length, true) : ""
            }`,
            classNames
          )}
        >
          {node}
        </div>
      ))}
    </div>
  );
}
