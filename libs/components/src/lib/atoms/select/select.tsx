'use client';
import { Fragment } from 'react';
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react';
import { HiCheck, HiChevronUpDown } from 'react-icons/hi2';
import { twMerge } from 'tailwind-merge';

export interface SelectItem<T> {
  text?: string;
  id: T;
  disabled?: boolean;
}

interface SelectProps<T> {
  items: SelectItem<T>[];
  selectedValue: T;
  onChange: (item: T) => void;
  topClassNames?: string;
  classNames?: string;
  label?: string;
  disabled?: boolean;
}

export function Select<T>({
  items,
  selectedValue,
  onChange,
  classNames = '',
  label,
  topClassNames,
  disabled,
}: SelectProps<T>) {
  const selectedItem = items.find((i) => i.id === selectedValue);
  return (
    <Listbox value={selectedValue} onChange={onChange} disabled={disabled}>
      <div className={topClassNames}>
        {label && <Label className="font-bold">{label}</Label>}
        <ListboxButton
          className={twMerge(
            'relative w-full cursor-default border-gray-400 border rounded-lg px-2 py-1.5 text-left',
            classNames
          )}
        >
          <span className={`block truncate ${disabled ? 'text-gray-600' : ''}`}>
            {`${selectedItem?.text ?? selectedValue}`}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ListboxOptions
            as="ul"
            className={twMerge(
              'z-10 absolute max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base',
              classNames
            )}
          >
            {items.map(({ text, id, disabled }) => (
              <ListboxOption
                as="li"
                key={`${id}`}
                className={({ focus }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    focus
                      ? 'bg-secondary-100 text-primary'
                      : disabled
                      ? 'text-gray-400 italic'
                      : 'text-gray-900'
                  }`
                }
                value={id}
                disabled={disabled}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {`${text ?? id}`}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}
