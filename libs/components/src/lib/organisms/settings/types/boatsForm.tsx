'use client';
import { boatForm, BoatForm, boatTypes, WedstrijdIdProps } from '@models';
import { useCallback } from 'react';
import { Input, TableForm } from '@components/server';
import { useSaveSettings } from '@hooks';
import toast from 'react-hot-toast';

interface BoatsFormProps extends WedstrijdIdProps {
  initialValues?: BoatForm;
}
export function BoatsForm({ initialValues, wedstrijdId }: BoatsFormProps) {
  const { mutate } = useSaveSettings({
    onSuccess: () =>
      toast.success(
        'De wijzigingen in de correctiefactoren en de prijzen van de boot types zijn opgeslagen!'
      ),
    wedstrijdId,
  });

  const onSubmit = useCallback(
    async (data: BoatForm) =>
      mutate({ type: 'boats', itemsToSave: data.items }),
    [mutate]
  );

  return (
    <TableForm
      onSubmit={onSubmit}
      schema={boatForm}
      defaultValues={getDefaultValues(initialValues)}
      gridHeaderItems={['Boottype', 'Correctiefactor', 'Prijs']}
      rowInputs={[
        { name: 'type', getValue: (field) => field.type },
        {
          name: 'correction',
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
          name: 'price',
          input: (field) => (
            <Input
              classNames="m-0"
              {...field}
              value={field.value as string}
              type="number"
            />
          ),
        },
      ]}
    />
  );
}

const getDefaultValues = (initialValues?: BoatForm): BoatForm => {
  if (initialValues && initialValues.items) {
    return initialValues;
  }
  return {
    items: boatTypes.map((val) => ({ type: val, correction: 1, price: 10 })),
  };
};
