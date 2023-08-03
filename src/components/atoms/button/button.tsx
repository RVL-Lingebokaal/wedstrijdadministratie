type Color = "primary" | "secondary" | "highlight";

interface ButtonProps {
  name: string;
  color: Color;
  onClick?: () => void;
  type?: "submit" | "button" | "reset";
  classNames?: string;
}

const colors = {
  highlight: "bg-highlight",
  primary: "bg-primary",
  secondary: "bg-secondary",
};

export function Button({
  name,
  color,
  onClick,
  type = "button",
  classNames = "",
}: ButtonProps) {
  return (
    <button
      className={`p-4 border-2 rounded-lg ${colors[color]} ${classNames}`}
      onClick={onClick}
      type={type}
    >
      <span className="text-white">{name}</span>
    </button>
  );
}
