import { colsOptions } from "../../utils/gridUtils";
import { twMerge } from "tailwind-merge";

interface Item {
  text: string;
  key?: string;
}

interface ClassRowProps {
  items: Item[];
  selected?: boolean;
  border?: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean };
  onClick: () => void;
  disabled?: boolean;
}

const Borders = {
  top: "border-t-highlight border-t-4",
  bottom: "border-b-highlight border-b-4",
  left: "border-l-highlight border-l-4",
  right: "border-r-highlight border-r-4",
};

export function ClassRow({
  items,
  selected = false,
  border,
  onClick,
  disabled,
}: ClassRowProps) {
  const borderText = border
    ? twMerge(
        border.bottom ? Borders.bottom : "",
        border.left ? Borders.left : "",
        border.top ? Borders.top : "",
        border.right ? Borders.right : ""
      )
    : "";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-3/4 text-left ${borderText}`}
    >
      <div className={`grid ${colsOptions[items.length]} mt-1 mx-1`}>
        {items.map(({ text, key }) => (
          <div
            key={key ?? text}
            className={`${
              selected ? "bg-highlight" : "bg-white"
            } py-3 px-4 font-bold`}
          >
            {text}
          </div>
        ))}
      </div>
    </button>
  );
}
