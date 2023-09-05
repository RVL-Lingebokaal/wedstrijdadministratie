import { colsOptions, getRoundedClass } from "../../utils/gridUtils";

interface GridHeaderProps {
  items: string[];
  needsRounding?: boolean;
}

export function GridHeader({ items, needsRounding = false }: GridHeaderProps) {
  return (
    <div
      className={`text-white text-xl grid ${
        colsOptions[items.length]
      } m-1 text-left`}
    >
      {items.map((item, index) => (
        <div
          key={item}
          className={`bg-secondary-500 py-3 px-4 ${
            needsRounding ? getRoundedClass(index, items.length, false) : ""
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
