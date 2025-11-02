import { ReactNode } from 'react';
import { colsOptions, getRoundedClass } from '@utils';
import { twMerge } from 'tailwind-merge';

export interface Item {
  node: string | ReactNode;
  isInput?: boolean;
}

interface GridRowProps {
  items: Item[];
  lastRow?: boolean;
  classNames?: string;
  classNameItems?: string;
}

export function GridRow({
  items,
  lastRow,
  classNames,
  classNameItems,
}: GridRowProps) {
  return (
    <div
      className={twMerge([`grid ${colsOptions[items.length]} m-1`, classNames])}
    >
      {items.map(({ node, isInput }, index) => (
        <div
          key={index}
          className={twMerge(
            'bg-white px-4',
            isInput ? 'py-1.5' : 'py-3',
            lastRow ? getRoundedClass(index, items.length, true) : '',
            classNameItems
          )}
        >
          {node}
        </div>
      ))}
    </div>
  );
}
