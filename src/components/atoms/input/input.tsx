import { ForwardedRef, forwardRef } from "react";

const borderColor = {
  regular: "border-gray-400",
  error: "border-red-600",
};

interface InputProps {
  onChange: () => void;
  label?: string;
  hasError?: boolean;
  noMargin?: boolean;
  disabled?: boolean;
}

export const Input = forwardRef(
  (
    { label, hasError, noMargin, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <div className={`${noMargin ? "m-0" : "mt-2"}`}>
        <label className="font-bold">{label}</label>
        <input
          className={`${
            borderColor[hasError ? "error" : "regular"]
          } border rounded-lg px-2 py-1.5 w-full`}
          type="text"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
