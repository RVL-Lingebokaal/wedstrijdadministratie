import {
  AgeForm,
  AgeStrategy,
  ageTranslations,
  AgeType,
} from "../../../../models/settings";
import { useCallback } from "react";
import { TableForm } from "../../table-form/tableForm";
import { ageFormSchema } from "../../../../schemas/ageFormSchema";
import { Input } from "../../../atoms/input/input";
import { Select } from "../../../atoms/select/select";
import { useSaveSettings } from "../../../../hooks/settings/useSaveSettings";

interface AgeFormProps {
  initialValues?: AgeForm;
}

export function AgesForm({ initialValues }: AgeFormProps) {
  const { mutate } = useSaveSettings();

  const onSubmit = useCallback(
    async (data: AgeForm) => mutate({ type: "ages", items: data.items }),
    [mutate]
  );

  return (
    <TableForm
      onSubmit={onSubmit}
      schema={ageFormSchema}
      defaultValues={getDefaultValues(initialValues)}
      gridHeaderItems={[
        "Klasse",
        "Leeftijd",
        "Correctiefactor Man",
        "Correctiefactor Vrouw",
        "Strategie",
      ]}
      rowInputs={[
        { name: "type", getValue: (field) => field.type },
        { name: "age", getValue: (field) => field.age },
        {
          name: "correctionMale",
          input: (field) => <Input noMargin {...field} />,
        },
        {
          name: "correctionFemale",
          input: (field) => <Input noMargin {...field} />,
        },
        {
          name: "strategy",
          input: (field) => (
            <Select
              selectedValue={field.value.toString()}
              onChange={field.onChange}
              items={Object.values(AgeStrategy).map((val) => ({ id: val }))}
            />
          ),
        },
      ]}
    />
  );
}
const getDefaultValues = (initialValues?: AgeForm) => {
  if (initialValues && initialValues.items) {
    return initialValues;
  }

  const values = Object.values(AgeType);
  return {
    items: values.map((val) => ({
      type: val,
      correctionMale: 1,
      correctionFemale: 10,
      strategy: AgeStrategy.average,
      age: ageTranslations[val],
    })),
  };
};
