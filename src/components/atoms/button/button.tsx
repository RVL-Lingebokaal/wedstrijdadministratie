import { FaSpinner } from "react-icons/fa";

type Color = "primary" | "secondary" | "highlight";

interface ButtonProps {
  name: string;
  color: Color;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  classNames?: string;
  isLoading?: boolean;
}

const colors = {
  highlight: "bg-highlight",
  primary: "bg-primary",
  secondary: "bg-secondary-500",
};

export function Button({
  name,
  color,
  onClick,
  type = "button",
  classNames = "",
  isLoading = false,
}: ButtonProps) {
  return (
    <button
      className={`p-3 border-2 rounded-lg ${colors[color]} ${classNames} flex`}
      onClick={onClick}
      type={type}
    >
      {isLoading && (
        <FaSpinner className="animate-spin text-white h-5 w-5 mr-3" />
      )}
      <span className="text-white">{name}</span>
    </button>
  );
}
