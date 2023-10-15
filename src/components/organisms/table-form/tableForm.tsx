import { GridHeader } from "../../atoms/grid-header/gridHeader";
import { GridRow } from "../../atoms/grid-row/gridRow";
import {
  ArrayPath,
  Controller,
  ControllerRenderProps,
  DefaultValues,
  FieldArrayWithId,
  FieldPath,
  Path,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Button } from "../../atoms/button/button";
import { ObjectSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AgeForm, BoatForm } from "../../../models/settings";
import { ReactElement } from "react";

export type Form = BoatForm | AgeForm;

interface RowHeaderItem<T extends Form> {
  input?: (field: ControllerRenderProps<T>) => ReactElement;
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
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<T>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all",
  });
  const { fields } = useFieldArray<T, ArrayPath<T>>({
    control,
    name: "items" as ArrayPath<T>,
  });

  return (
    <div className="w-full flex">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-4 w-full">
          <div className="flex">
            <GridHeader
              items={gridHeaderItems}
              needsRounding
              classNames="w-4/5"
            />
            <Button
              name="Opslaan"
              color="highlight"
              type="submit"
              classNames=" flex items-center my-1 max-h-14"
            />
          </div>

          {fields.map((field, index) => (
            <GridRow
              key={field.id}
              items={rowInputs.map(({ name, input, getValue }) => ({
                node: input ? (
                  <Controller
                    control={control}
                    name={`items.${index}.${String(name)}` as Path<T>}
                    render={({ field }) => input(field)}
                  />
                ) : (
                  getValue?.(field) ?? ""
                ),
                isInput: Boolean(input),
              }))}
              lastRow={index === fields.length - 1}
              classNames="w-4/5"
            />
          ))}
        </div>
      </form>
    </div>
  );
}
