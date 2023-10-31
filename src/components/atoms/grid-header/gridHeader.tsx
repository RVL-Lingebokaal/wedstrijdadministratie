import { colsOptions, getRoundedClass } from "../../utils/gridUtils";
import { twMerge } from "tailwind-merge";

export interface GridHeaderItem {
  node: string;
  classNames?: string;
}

interface GridHeaderProps {
  items: GridHeaderItem[];
  needsRounding?: boolean;
  classNames?: string;
  itemsCount?: number;
}

export function GridHeader({
  items,
  needsRounding = false,
  classNames,
  itemsCount,
}: GridHeaderProps) {
  return (
    <div
      className={twMerge(
        "text-white text-xl grid m-1 text-left",
        colsOptions[itemsCount ?? items.length],
        classNames
      )}
    >
      {items.map(({ node, classNames }, index) => (
        <div
          key={node}
          className={twMerge(
            `bg-secondary-500 py-3 px-4 ${
              needsRounding ? getRoundedClass(index, items.length, false) : ""
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
