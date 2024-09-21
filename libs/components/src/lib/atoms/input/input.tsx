import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

const borderColor = {
  regular: 'border-gray-400',
  error: 'border-red-600',
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  hasError?: boolean;
  classNames?: string;
  disabled?: boolean;
}

export const Input = forwardRef(
  (
    { label, hasError, classNames, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <div className={twMerge('mt-2', classNames)}>
        <label className="font-bold">{label}</label>
        <input
          className={`${
            borderColor[hasError ? 'error' : 'regular']
          } border rounded-lg px-2 py-1.5 w-full`}
          type="text"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
