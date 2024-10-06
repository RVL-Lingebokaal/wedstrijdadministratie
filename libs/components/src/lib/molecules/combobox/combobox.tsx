import {
  Combobox as HeadlessCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { useState } from 'react';
import { FaCheck, FaChevronDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

interface ComboboxProps {
  values: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

export function Combobox({
  values,
  setSelectedItem,
  selectedItem,
}: ComboboxProps) {
  const [query, setQuery] = useState('');

  const filteredValues =
    query === ''
      ? values
      : values.filter((value) => {
          return value.toString().toLowerCase().includes(query.toLowerCase());
        });

  return (
    <div>
      <HeadlessCombobox
        value={selectedItem}
        onClose={() => setQuery('')}
        onChange={(event) => setSelectedItem(event ?? '')}
      >
        <div className="relative">
          <ComboboxInput
            className={twMerge(
              'w-full rounded-lg border-none bg-white py-1.5 pr-8 pl-3 text-sm/6 text-primary',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )}
            displayValue={(value: string) => value}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            autoFocus
          />
          <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
            <FaChevronDown className="size-4 fill-primary group-data-[hover]:fill-primary" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom"
          transition
          className={twMerge(
            'w-[var(--input-width)] rounded-xl border border-white/5 bg-white/25 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
            'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
          )}
        >
          {filteredValues.map((value) => (
            <ComboboxOption
              key={value}
              value={value}
              className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none bg-white/50 data-[focus]:bg-white/75"
            >
              <FaCheck className="invisible size-4 fill-primary group-data-[selected]:visible" />
              <div className="text-sm/6 text-primary ">{value}</div>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </HeadlessCombobox>
    </div>
  );
}
