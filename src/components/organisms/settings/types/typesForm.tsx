import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { typesFormSchema } from "../../../../schemas/typesFormSchema";
import { GridHeader } from "../../../atoms/grid-header/gridHeader";
import { BootTypes } from "../../../../models/boot";
import { GridRow } from "../../../atoms/grid-row/gridRow";
import { Input } from "../../../atoms/input/input";
import { Button } from "../../../atoms/button/button";
import { useCallback } from "react";

interface FormValue {
  items: { type: BootTypes; correction: number; price: number }[];
}

export function TypesForm() {
  const { handleSubmit, control } = useForm<FormValue>({
    resolver: yupResolver(typesFormSchema),
    defaultValues: getDefaultValues(),
    mode: "all",
  });
  const { fields } = useFieldArray({ control, name: "items" });

  const onSubmit = useCallback((data: FormValue) => {
    console.log(data);
  }, []);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="w-3xl">
        <div className="mx-4">
          <GridHeader items={["Boottype", "Correctiefactor", "Prijs"]} />
          {fields.map(({ type, id }, index) => (
            <GridRow
              key={id}
              items={[
                { node: type },
                {
                  node: (
                    <Controller
                      key={id}
                      control={control}
                      name={`items.${index}.correction`}
                      render={({ field }) => <Input {...field} />}
                    />
                  ),
                  isInput: true,
                },
                {
                  node: (
                    <Controller
                      key={id}
                      control={control}
                      name={`items.${index}.price`}
                      render={({ field }) => <Input {...field} />}
                    />
                  ),
                  isInput: true,
                },
              ]}
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
const getDefaultValues = () => {
  const values = Object.values(BootTypes);
  return {
    items: values.map((val) => ({ type: val, correction: 1, price: 10 })),
  };
};
