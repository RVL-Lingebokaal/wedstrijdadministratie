import { GridHeader } from "../../atoms/grid-header/gridHeader";
import { GridRow } from "../../atoms/grid-row/gridRow";
import {
  Controller,
  DefaultValues,
  FieldPath,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Input } from "../../atoms/input/input";
import { Button } from "../../atoms/button/button";
import { ObjectSchema } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { BootForm } from "../../../models/boot";

interface RowHeaderItem {
  isInput?: boolean;
  name: FieldPath<Form["items"][0]>;
}

type Form = BootForm;

interface TableFormProps {
  onSubmit: (val: Form) => void;
  schema: ObjectSchema<Form>;
  defaultValues: DefaultValues<Form>;
  gridHeaderItems: string[];
  rowInputs: RowHeaderItem[];
}

export function TableForm({
  onSubmit,
  schema,
  defaultValues,
  rowInputs,
  gridHeaderItems,
}: TableFormProps) {
  const { handleSubmit, control } = useForm<Form>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: "all",
  });
  const { fields } = useFieldArray<Form>({ control, name: "items" });

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-3xl">
        <div className="mx-4">
          <GridHeader items={gridHeaderItems} />
          {fields.map((field, index) => (
            <GridRow
              key={field.id}
              items={rowInputs.map(({ name, isInput }) => ({
                node: isInput ? (
                  <Controller
                    key={field.id}
                    control={control}
                    name={`items.${index}.${name}`}
                    render={({ field }) => <Input {...field} />}
                  />
                ) : (
                  field[name]
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
