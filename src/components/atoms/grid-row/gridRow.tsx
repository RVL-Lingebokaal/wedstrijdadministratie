import { ReactNode } from "react";
import { colsOptions, getRoundedClass } from "../../utils/gridUtils";
import { twMerge } from "tailwind-merge";

export interface Item {
  node: string | ReactNode;
  isInput?: boolean;
}

interface GridRowProps {
  items: Item[];
  lastRow?: boolean;
  classNames?: string;
}

export function GridRow({ items, lastRow, classNames }: GridRowProps) {
  return (
    <div
      className={twMerge([`grid ${colsOptions[items.length]} m-1`, classNames])}
    >
      {items.map(({ node, isInput }, index) => (
        <div
          key={index}
          className={`bg-white ${isInput ? "py-1.5" : "py-3"} px-4 ${
            lastRow ? getRoundedClass(index, items.length, true) : ""
          }`}
        >
          {node}
        </div>
      ))}
    </div>
  );
}
