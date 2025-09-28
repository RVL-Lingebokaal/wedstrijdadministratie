import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  HTMLInputTypeAttribute,
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
  type?: HTMLInputTypeAttribute;
}

export const Input = forwardRef(
  (
    { label, hasError, classNames, onChange, type, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    return (
      <div className={twMerge('mt-2', classNames)}>
        <label className="font-bold" htmlFor={props.name}>
          {label}
        </label>
        <input
          className={`${
            borderColor[hasError ? 'error' : 'regular']
          } border rounded-lg px-2 py-1.5 w-full`}
          ref={ref}
          id={props.name}
          type={type}
          onChange={(val) => {
            if (type === 'number') {
              const value = val.target.value;
              const numericValue = value === '' ? '' : Number(value);
              onChange?.({
                ...val,
                target: {
                  ...val.target,
                  value: numericValue,
                },
              } as ChangeEvent<HTMLInputElement>);
            } else {
              onChange?.(val);
            }
          }}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
