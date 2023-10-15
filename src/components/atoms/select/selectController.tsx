import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Select, SelectItem } from "./select";
import SelectGender from "./selectGender";

interface SelectControllerProps<T extends FieldValues, V> {
  path: Path<T>;
  control: Control<T>;
  label?: string;
  items?: SelectItem<V>[];
  topClassNames?: string;
  isGender?: boolean;
  classNames?: string;
  onSelect?: (val: V) => void;
  disabled?: boolean;
}

export default function SelectController<T extends FieldValues, V>({
  path,
  control,
  label,
  items,
  topClassNames,
  isGender,
  classNames,
  onSelect,
  disabled,
}: SelectControllerProps<T, V>) {
  return (
    <Controller
      name={path}
      control={control}
      render={({ field }) =>
        isGender ? (
          <SelectGender
            selectedValue={field.value}
            onChange={(val) => field.onChange(val)}
            classNames={classNames}
            label={label}
            topClassNames={topClassNames}
            disabled={disabled}
          />
        ) : (
          <Select
            items={items ?? []}
            selectedValue={field.value}
            onChange={(val) => {
              field.onChange(val);
              onSelect?.(val);
            }}
            label={label}
            topClassNames={topClassNames}
            classNames={classNames}
            disabled={disabled}
          />
        )
      }
    />
  );
}
