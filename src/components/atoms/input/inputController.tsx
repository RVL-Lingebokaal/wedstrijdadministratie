import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "./input";

interface InputControllerProps<T extends FieldValues> {
  path: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
  classNames?: string;
}

export default function InputController<T extends FieldValues>({
  path,
  control,
  label,
  disabled,
  classNames,
}: InputControllerProps<T>) {
  return (
    <Controller
      name={path}
      control={control}
      render={({ field, fieldState }) => (
        <Input
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
