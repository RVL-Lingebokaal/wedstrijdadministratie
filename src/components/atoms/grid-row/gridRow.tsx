import { ReactNode } from "react";
import { getRoundedClass } from "../../utils/gridUtils";

interface Item {
  node: string | ReactNode;
  isInput?: boolean;
}

interface GridRowProps {
  items: Item[];
  lastRow?: boolean;
}

export function GridRow({ items, lastRow }: GridRowProps) {
  return (
    <div className="grid grid-cols-3 m-1">
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
