import { typesFormSchema } from "../../../../schemas/typesFormSchema";
import { BootForm, BootTypes } from "../../../../models/settings";
import { useCallback } from "react";
import { TableForm } from "../../table-form/tableForm";
import { Input } from "../../../atoms/input/input";

export function TypesForm() {
  const onSubmit = useCallback((data: BootForm) => {
    console.log(data);
  }, []);

  return (
    <TableForm
      onSubmit={onSubmit}
      schema={typesFormSchema}
      defaultValues={getDefaultValues()}
      gridHeaderItems={["Boottype", "Correctiefactor", "Prijs"]}
      rowInputs={[
        { name: "type", getValue: (field) => field.type },
        { name: "correction", input: (field) => <Input {...field} /> },
        { name: "price", input: (field) => <Input {...field} /> },
      ]}
    />
  );
}
const getDefaultValues = () => {
  const values = Object.values(BootTypes);
  return {
    items: values.map((val) => ({ type: val, correction: 1, price: 10 })),
  };
};
