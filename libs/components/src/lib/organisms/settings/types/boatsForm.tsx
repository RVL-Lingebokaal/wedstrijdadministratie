'use client';
import { boatForm, BoatForm, boatTypes } from '@models';
import { useCallback } from 'react';
import { Input, TableForm } from '@components/server';
import { useSaveSettings } from '@hooks';
import toast from 'react-hot-toast';

interface BoatsFormProps {
  initialValues?: BoatForm;
}
export function BoatsForm({ initialValues }: BoatsFormProps) {
  const { mutate } = useSaveSettings({
    onSuccess: () =>
      toast.success(
        'De wijzigingen in de correctiefactoren van de boot types zijn opgeslagen!'
      ),
  });

  const onSubmit = useCallback(
    async (data: BoatForm) => mutate({ type: 'boats', items: data.items }),
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
            <Input classNames="m-0" {...field} value={field.value as string} />
          ),
        },
        {
          name: 'price',
          input: (field) => (
            <Input classNames="m-0" {...field} value={field.value as string} />
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
