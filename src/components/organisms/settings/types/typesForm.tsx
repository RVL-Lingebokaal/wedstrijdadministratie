import { typesFormSchema } from "../../../../schemas/typesFormSchema";
import { BootForm, BootTypes } from "../../../../models/settings";
import { useCallback } from "react";
import { TableForm } from "../../table-form/tableForm";
import { Input } from "../../../atoms/input/input";
import { useSaveSettings } from "../../../../hooks/useSaveSettings";

interface TypesFormProps {
  initialValues?: BootForm;
}
export function TypesForm({ initialValues }: TypesFormProps) {
  const { mutate } = useSaveSettings();

  const onSubmit = useCallback(
    async (data: BootForm) => mutate({ type: "boots", items: data.items }),
    [mutate]
  );

  return (
    <TableForm
      onSubmit={onSubmit}
      schema={typesFormSchema}
      defaultValues={getDefaultValues(initialValues)}
      gridHeaderItems={["Boottype", "Correctiefactor", "Prijs"]}
      rowInputs={[
        { name: "type", getValue: (field) => field.type },
        { name: "correction", input: (field) => <Input {...field} /> },
        { name: "price", input: (field) => <Input {...field} /> },
      ]}
    />
  );
}
const getDefaultValues = (initialValues?: BootForm) => {
  if (initialValues && initialValues.items) {
    return initialValues;
  }

  const values = Object.values(BootTypes);
  return {
    items: values.map((val) => ({ type: val, correction: 1, price: 10 })),
  };
};
