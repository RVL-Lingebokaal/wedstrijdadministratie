import { ForwardedRef, forwardRef } from "react";

const borderColor = {
  regular: "border-gray-400",
  error: "border-red-600",
};

interface InputProps {
  onChange: () => void;
  label?: string;
  hasError?: boolean;
  classNames?: string;
  noMargin?: boolean;
  disabled?: boolean;
}

export const Input = forwardRef(
  (
    { label, hasError, noMargin, classNames, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <div className={twMerge(`${noMargin ? "m-0" : "mt-2"}`, classNames)}>
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
