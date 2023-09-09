import { forwardRef } from "react";

interface InputProps {
  onChange: () => void;
  label?: string;
}

export const Input = forwardRef(({ label, ...props }: InputProps, ref) => {
  return (
    <div className="mt-2">
      <label className="font-bold">{label}</label>
      <input
        className="border-gray-400 border rounded-lg px-2 py-1.5 w-full"
        type="text"
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";
