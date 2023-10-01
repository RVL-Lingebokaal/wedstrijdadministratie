import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  classNames?: string;
}

export function IconButton({
  onClick,
  icon,
  classNames = "",
}: IconButtonProps) {
  return (
    <button onClick={onClick} className={classNames}>
      {icon}
    </button>
  );
}
