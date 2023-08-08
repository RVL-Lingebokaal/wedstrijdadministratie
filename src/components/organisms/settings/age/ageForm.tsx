import {
  AgeForm,
  AgeStrategy,
  ageTranslations,
  AgeTypes,
} from "../../../../models/settings";
import { useCallback } from "react";
import { TableForm } from "../../table-form/tableForm";
import { ageFormSchema } from "../../../../schemas/ageFormSchema";

export function AgesForm() {
  const onSubmit = useCallback((data: AgeForm) => {
    console.log(data);
  }, []);

  return (
    <TableForm
      onSubmit={onSubmit}
      schema={ageFormSchema}
      defaultValues={getDefaultValues()}
      gridHeaderItems={[
        "Leeftijdsklasse",
        "Leeftijd",
        "Correctiefactor Man",
        "Correctiefactor Vrouw",
        "Strategie",
      ]}
      rowInputs={[
        { name: "type", getValue: (field) => field.type },
        { name: "age", getValue: (field) => field.age },
        { name: "correctionMale", isInput: true },
        { name: "correctionFemale", isInput: true },
        { name: "strategy", isInput: true },
      ]}
    />
  );
}
const getDefaultValues = () => {
  const values = Object.values(AgeTypes);
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
