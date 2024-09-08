import { typesFormSchema } from "../../../../schemas/typesFormSchema";
import { BoatForm, BoatType } from "../../../../models/settings";
import { useCallback } from "react";
import { TableForm } from "../../table-form/tableForm";
import { Input } from "../../../atoms/input/input";
import { useSaveSettings } from "../../../../hooks/settings/useSaveSettings";
import toast from "react-hot-toast";

interface TypesFormProps {
  initialValues?: BoatForm;
}
export function TypesForm({ initialValues }: TypesFormProps) {
  const { mutate } = useSaveSettings({
    onSuccess: () =>
      toast.success(
        "De wijzigingen in de correctiefactoren van de boot types zijn opgeslagen!"
      ),
  });

  const onSubmit = useCallback(
    async (data: BoatForm) => mutate({ type: "boats", items: data.items }),
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
        {
          name: "correction",
          input: (field) => (
            <Input classNames="m-0" {...field} value={field.value as string} />
          ),
        },
        {
          name: "price",
          input: (field) => (
            <Input classNames="m-0" {...field} value={field.value as string} />
          ),
        },
      ]}
    />
  );
}
const getDefaultValues = (initialValues?: BoatForm) => {
  if (initialValues && initialValues.items) {
    return initialValues;
  }

  const values = Object.values(BoatType);
  return {
    items: values.map((val) => ({ type: val, correction: 1, price: 10 })),
  };
};
