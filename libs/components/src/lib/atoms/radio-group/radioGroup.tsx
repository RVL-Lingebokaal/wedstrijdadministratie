import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';

const cols: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

interface StyledRadioGroupProps<T> {
  items: { label: string; value: T }[];
  selected: T;
  onChange: (value: T) => void;
}

export function StyledRadioGroup<T>({
  items,
  selected,
  onChange,
}: StyledRadioGroupProps<T>) {
  return (
    <RadioGroup
      value={selected}
      onChange={onChange}
      className={twMerge('grid gap-2', cols[items.length])}
    >
      {items.map(({ label, value }) => (
        <Field key={label} className="flex items-center gap-2">
          <Radio
            value={value}
            className="group flex size-6 items-center justify-center rounded-full border bg-white data-[checked]:bg-primary"
          >
            <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
          </Radio>
          <Label>{label}</Label>
        </Field>
      ))}
    </RadioGroup>
  );
}
