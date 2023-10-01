import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "./input";

interface InputControllerProps<T extends FieldValues> {
  path: Path<T>;
  control: Control<T>;
  label?: string;
  disabled?: boolean;
}

export default function InputController<T extends FieldValues>({
  path,
  control,
  label,
  disabled,
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
          {...field}
        />
      )}
    />
  );
}
