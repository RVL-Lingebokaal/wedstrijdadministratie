'use client';
import {
  AgeForm,
  ageStrategies,
  ageTranslations,
  ageTypes,
  WedstrijdIdProps,
} from '@models';
import { useCallback } from 'react';
import { Input, Select, TableForm } from '@components/server';
import { ageFormSchema } from '@schemas';
import { useSaveSettings } from '@hooks';
import toast from 'react-hot-toast';

interface AgeFormProps extends WedstrijdIdProps {
  initialValues?: AgeForm;
}

export function AgesForm({ initialValues, wedstrijdId }: AgeFormProps) {
  const { mutate } = useSaveSettings({
    onSuccess: () =>
      toast.success(
        'De wijzigingen in de correctiefactoren van de leeftijd zijn opgeslagen!'
      ),
    wedstrijdId,
  });

  const onSubmit = useCallback(
    async (data: AgeForm) => {
      mutate({ type: 'ages', itemsToSave: data.items });
    },
    [mutate]
  );

  return (
    <TableForm
      onSubmit={onSubmit}
      schema={ageFormSchema}
      defaultValues={getDefaultValues(initialValues)}
      gridHeaderItems={[
        'Klasse',
        'Leeftijd',
        'Correctiefactor Man',
        'Correctiefactor Vrouw',
        'Strategie',
      ]}
      rowInputs={[
        { name: 'type', getValue: (field) => field.type },
        { name: 'age', getValue: (field) => field.age },
        {
          name: 'correctionMale',
          input: (field) => (
            <Input
              classNames="m-0"
              {...field}
              value={field.value as string}
              type="number"
            />
          ),
        },
        {
          name: 'correctionFemale',
          input: (field) => (
            <Input
              classNames="m-0"
              {...field}
              value={field.value as string}
              type="number"
            />
          ),
        },
        {
          name: 'strategy',
          input: (field) => (
            <Select<string>
              selectedValue={field.value.toString()}
              onChange={field.onChange}
              items={ageStrategies.map((val) => ({ id: val }))}
            />
          ),
        },
      ]}
    />
  );
}

const getDefaultValues = (initialValues?: AgeForm): AgeForm => {
  if (initialValues && initialValues.items) {
    return initialValues;
  }

  return {
    items: ageTypes.map((val) => ({
      type: val,
      correctionMale: 1,
      correctionFemale: 10,
      strategy: 'gemiddeld',
      age: ageTranslations[val],
    })),
  };
};
