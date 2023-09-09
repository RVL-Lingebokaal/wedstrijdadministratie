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
import { ReactElement, useEffect } from "react";

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
  const { handleSubmit, control, formState } = useForm<T>({
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
          <GridHeader items={gridHeaderItems} needsRounding />
          {fields.map((field, index) => (
            <GridRow
              key={field.id}
              items={rowInputs.map(({ name, input, getValue }) => ({
                node: input ? (
                  <Controller
                    key={field.id}
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
