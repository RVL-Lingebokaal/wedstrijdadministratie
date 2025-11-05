import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Checkbox } from './checkbox';

interface CheckboxControllerProps<T extends FieldValues> {
  path: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
}

export function CheckboxController<T extends FieldValues>({
  path,
  control,
  label,
}: CheckboxControllerProps<T>) {
  return (
    <Controller
      name={path}
      control={control}
      render={({ field }) => (
        <Checkbox
          label={label}
          setEnabled={field.onChange}
          enabled={field.value}
        />
      )}
    />
  );
}
