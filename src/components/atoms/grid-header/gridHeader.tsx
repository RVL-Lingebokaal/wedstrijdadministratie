import { colsOptions, getRoundedClass } from "../../utils/gridUtils";

interface GridHeaderProps {
  items: string[];
}

export function GridHeader({ items }: GridHeaderProps) {
  return (
    <div className={`text-white text-xl grid ${colsOptions[items.length]} m-1`}>
      {items.map((item, index) => (
        <div
          key={item}
          className={`bg-secondary-500 py-3 px-4 ${getRoundedClass(
            index,
            items.length,
            false
          )}`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
