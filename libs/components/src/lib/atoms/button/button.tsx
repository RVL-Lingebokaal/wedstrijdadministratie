import { FaSpinner } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

export type Color =
  | 'primary'
  | 'secondary'
  | 'highlight'
  | 'error'
  | 'white'
  | 'highlightReverse';

interface ButtonProps {
  name: string;
  color: Color;
  onClick?: () => void;
  type?: 'submit' | 'button' | 'reset';
  classNames?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const colors = {
  highlight: 'bg-highlight',
  primary: 'bg-primary',
  secondary: 'bg-secondary-500',
  error: 'bg-red-600',
  white: 'bg-white',
  highlightReverse: 'bg-white',
};
const borderColors = {
  highlight: 'border-highlight',
  primary: 'border-primary',
  secondary: 'border-secondary-500',
  error: 'border-red-600',
  white: 'border-primary',
  highlightReverse: 'border-highlight',
};

export function Button({
  name,
  color,
  onClick,
  type = 'button',
  classNames = '',
  isLoading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={twMerge([
        'py-2 px-4 border-2 rounded-lg',
        colors[color],
        borderColors[color],
        disabled ? 'opacity-50' : '',
        classNames,
      ])}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      type={type}
      disabled={disabled}
    >
      {isLoading && (
        <FaSpinner className="animate-spin text-white h-5 w-5 mr-3" />
      )}
      <span
        className={`${
          color === 'white'
            ? 'text-primary'
            : color === 'highlightReverse'
            ? 'text-highlight'
            : 'text-white'
        }`}
      >
        {name}
      </span>
    </button>
  );
}
