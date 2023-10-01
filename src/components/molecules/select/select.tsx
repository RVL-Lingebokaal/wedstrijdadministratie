import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

interface SelectProps {
  items: string[] | number[];
  selectedValue: string;
  onChange: (item: string) => void;
  topClassNames?: string;
  classNames?: string;
  label?: string;
}

export function Select({
  items,
  selectedValue,
  onChange,
  classNames = "",
  label,
  topClassNames,
}: SelectProps) {
  return (
    <Listbox value={selectedValue} onChange={onChange}>
      <div className={topClassNames}>
        {label && <Listbox.Label className="font-bold">{label}</Listbox.Label>}
        <Listbox.Button
          className={twMerge(
            "relative w-full cursor-default border-gray-400 border rounded-lg px-2 py-1.5 text-left",
            classNames
          )}
        >
          <span className="block truncate">{selectedValue}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronUpDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={twMerge(
              "z-10 absolute max-h-60 overflow-auto rounded-md bg-white py-1 text-base",
              classNames
            )}
          >
            {items.map((item) => (
              <Listbox.Option
                key={item}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-secondary-100 text-primary" : "text-gray-900"
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {item}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
