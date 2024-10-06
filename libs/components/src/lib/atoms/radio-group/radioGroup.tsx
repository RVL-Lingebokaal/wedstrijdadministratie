import { Field, Label, Radio, RadioGroup } from '@headlessui/react';

interface StyledRadioGroupProps {
  items: { label: string; value: boolean }[];
  selected: boolean;
  onChange: (value: boolean) => void;
}

export function StyledRadioGroup({
  items,
  selected,
  onChange,
}: StyledRadioGroupProps) {
  return (
    <RadioGroup value={selected} onChange={onChange} className="flex gap-6">
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
