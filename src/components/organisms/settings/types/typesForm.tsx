import { typesFormSchema } from "../../../../schemas/typesFormSchema";
import { BootForm, BootTypes } from "../../../../models/boot";
import { useCallback } from "react";
import { TableForm } from "../../table-form/tableForm";

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
        { name: "type" },
        { name: "correction", isInput: true },
        { name: "price", isInput: true },
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
