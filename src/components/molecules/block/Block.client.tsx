import { ReactNode } from "react";
import { LoadingSpinner } from "../../atoms/loading-spinner/loadingSpinner";

interface BlockProps {
  title?: string;
  bottom?: string;
  children: ReactNode;
  variant: "small" | "large";
}

export function Block({ title, bottom, children, variant }: BlockProps) {
  return (
    <div
      className={`place-items-center flex flex-col border-4 border-secondary-500 bg-white flex-1 ${
        variant === "small" ? "px-7 py-5" : "p-12"
      }`}
    >
      {title && <h4 className="text-4xl font-extrabold">{title}</h4>}
      {children}
      {bottom && <p className="text-3xl uppercase">{bottom}</p>}
    </div>
  );
}
