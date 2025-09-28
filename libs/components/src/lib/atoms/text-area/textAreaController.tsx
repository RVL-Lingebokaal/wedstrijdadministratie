import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { TextArea } from './textarea';

interface TextAreaControllerProps<T extends FieldValues> {
  path: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
  classNames?: string;
}

export function TextAreaController<T extends FieldValues>({
  path,
  control,
  label,
  disabled,
  classNames,
}: TextAreaControllerProps<T>) {
  return (
    <Controller
      name={path}
      control={control}
      render={({ field, fieldState }) => (
        <TextArea
          disabled={disabled}
          label={label}
          hasError={fieldState.invalid}
          classNames={classNames}
          {...field}
        />
      )}
    />
  );
}
