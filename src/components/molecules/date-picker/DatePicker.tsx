import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Input } from "../../atoms/input/input";

interface DatePickerProps<T extends FieldValues> {
  path: Path<T>;
  control: Control<T>;
}

export default function DatePicker<T extends FieldValues>({
  path,
  control,
}: DatePickerProps<T>) {
  return (
    <div className="flex flex-col h-auto">
      <div className="flex">
        <Controller
          control={control}
          render={({ field }) => (
            <>
              <Input
                className="mr-0 py-3 px-2 rounded-md"
                type="date"
                min="1900-01-01"
                {...field}
              />
            </>
          )}
          name={path}
        />
      </div>
    </div>
  );
}
