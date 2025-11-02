import { Checkbox as HeadlessCheckbox, Field, Label } from '@headlessui/react';
import { FaCheck } from 'react-icons/fa';

interface CheckboxProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  label: string;
}

export function Checkbox({ enabled, setEnabled, label }: CheckboxProps) {
  return (
    <Field className="flex items-center gap-2">
      <HeadlessCheckbox
        checked={enabled}
        onChange={setEnabled}
        className="group block size-4 rounded border bg-white data-checked:bg-blue-500"
      >
        {enabled ? <FaCheck className="fill-primary" /> : null}
      </HeadlessCheckbox>
      <Label>{label}</Label>
    </Field>
  );
}
