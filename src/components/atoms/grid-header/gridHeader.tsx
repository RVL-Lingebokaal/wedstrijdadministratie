import { getRoundedClass } from "../../utils/gridUtils";

interface GridHeaderProps {
  items: string[];
}

export function GridHeader({ items }: GridHeaderProps) {
  return (
    <div className="text-white text-xl grid grid-cols-3 m-1">
      {items.map((item, index) => (
        <div
          key={item}
          className={`bg-secondary py-3 px-4 ${getRoundedClass(
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
