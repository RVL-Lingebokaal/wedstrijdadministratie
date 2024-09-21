import { colsOptions, getRoundedClass } from '@utils';
import { twMerge } from 'tailwind-merge';

const colors = {
  secondary: 'bg-secondary-500',
  primary: 'bg-primary',
  success: 'bg-success-500',
};

interface GridHeaderProps {
  items: string[];
  needsRounding?: boolean;
  classNames?: string;
  color?: 'primary' | 'secondary' | 'success';
}

export function GridHeader({
  items,
  needsRounding = false,
  classNames,
  color = 'secondary',
}: GridHeaderProps) {
  return (
    <div
      className={twMerge(
        'text-white text-xl grid m-1 text-left',
        colsOptions[items.length],
        classNames
      )}
    >
      {items.map((item, index) => (
        <div
          key={item}
          className={`${colors[color]} py-3 px-4 ${
            needsRounding ? getRoundedClass(index, items.length, false) : ''
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
