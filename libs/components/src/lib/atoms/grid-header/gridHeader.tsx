import { colsOptions, getRoundedClass } from '@utils';
import { twMerge } from 'tailwind-merge';

interface GridHeaderProps {
  items: string[];
  needsRounding?: boolean;
  classNames?: string;
}

export function GridHeader({
  items,
  needsRounding = false,
  classNames,
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
          className={`bg-secondary-500 py-3 px-4 ${
            needsRounding ? getRoundedClass(index, items.length, false) : ''
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
