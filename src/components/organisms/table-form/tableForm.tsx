import { GridHeader } from "../../atoms/grid-header/gridHeader";
import { GridRow } from "../../atoms/grid-row/gridRow";
import {
  ArrayPath,
  Controller,
  DefaultValues,
  FieldArrayWithId,
  FieldPath,
  Path,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { ObjectSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AgeForm, BootForm } from "../../../models/settings";

export type Form = BootForm | AgeForm;

interface RowHeaderItem<T extends Form> {
  isInput?: boolean;
  getValue?: (field: FieldArrayWithId<T, ArrayPath<T>>) => string;
  name: FieldPath<T["items"][0]>;
}

interface TableFormProps<T extends Form> {
  onSubmit: (val: T) => void;
  schema: ObjectSchema<T>;
  defaultValues: DefaultValues<T>;
  gridHeaderItems: string[];
  rowInputs: RowHeaderItem<T>[];
}

export function TableForm<T extends Form>({
  onSubmit,
  schema,
  defaultValues,
  rowInputs,
  gridHeaderItems,
}: TableFormProps<T>) {
  const { handleSubmit, control } = useForm<T>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all",
  });
  const { fields } = useFieldArray<T, ArrayPath<T>>({
    control,
    name: "items" as ArrayPath<T>,
  });

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-4xl">
        <div className="mx-4">
          <GridHeader items={gridHeaderItems} />
          {fields.map((field, index) => (
            <GridRow
              key={field.id}
              items={rowInputs.map(({ name, isInput, getValue }) => ({
                node: isInput ? (
                  <Controller
                    key={field.id}
                    control={control}
                    name={`items.${index}.${String(name)}` as Path<T>}
                    render={({ field }) => <Input {...field} />}
                  />
                ) : (
                  getValue?.(field) ?? ""
                ),
                isInput,
              }))}
              lastRow={index === fields.length - 1}
            />
          ))}
        </div>
        <Button
          name="Opslaan"
          color="highlight"
          type="submit"
          classNames="float-right mx-4 my-2"
        />
      </form>
    </div>
  );
}
