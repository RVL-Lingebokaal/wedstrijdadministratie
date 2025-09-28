'use client';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Input } from '../../atoms/input/input';

interface DatePickerProps<T extends FieldValues> {
  path: Path<T>;
  control: Control<T>;
  classNames?: string;
  label?: string;
}

export function DatePicker<T extends FieldValues>({
  path,
  control,
  label,
  classNames,
}: DatePickerProps<T>) {
  return (
    <Controller
      control={control}
      render={({ field }) => (
        <>
          <Input
            className="rounded-lg border px-2 py-1.5 w-full border-gray-400"
            type="date"
            min="1900-01-01"
            label={label}
            classNames={classNames}
            {...field}
          />
        </>
      )}
      name={path}
    />
  );
}
