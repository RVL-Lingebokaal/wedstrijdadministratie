import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  TextareaHTMLAttributes,
} from 'react';
import { twMerge } from 'tailwind-merge';

const borderColor = {
  regular: 'border-gray-400',
  error: 'border-red-600',
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (val: ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  hasError?: boolean;
  classNames?: string;
  disabled?: boolean;
}

export const TextArea = forwardRef(
  (
    { label, hasError, classNames, ...props }: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement | null>
  ) => {
    return (
      <div className={twMerge('mt-2', classNames)}>
        <label className="font-bold">{label}</label>
        <textarea
          className={`${
            borderColor[hasError ? 'error' : 'regular']
          } border rounded-lg px-2 py-1.5 w-full`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
