'use client';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  DatePicker,
  InputController,
  TextAreaController,
} from '@components/server';
import { addWedstrijdSchema, WedstrijdAddForm } from '@schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useCreateWedstrijd } from '@hooks';

export default function CreateWedstrijd() {
  const { mutate } = useCreateWedstrijd();

  const methods = useForm<WedstrijdAddForm>({
    resolver: zodResolver(addWedstrijdSchema),
    defaultValues: {
      name: '',
      description: '',
      date: DateTime.now().toISODate(),
      amountOfBlocks: 1,
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

  const onSubmit = useCallback(
    async (values: WedstrijdAddForm) => {
      mutate(values);
    },
    [mutate]
  );

  return (
    <div className="max-w-xl px-4">
      <h1 className="text-2xl font-bold text-primary mb-2">Creeër wedstrijd</h1>
      <p>Op deze pagina kan je een nieuwe wedstrijd maken. </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <InputController<WedstrijdAddForm>
            label="Naam van de wedstrijd"
            path="name"
            control={control}
          />
          <DatePicker<WedstrijdAddForm>
            path="date"
            control={control}
            label="Datum wedstrijd"
          />
          <TextAreaController<WedstrijdAddForm>
            label="Omschrijving van de wedstrijd"
            path="description"
            control={control}
          />
          <InputController<WedstrijdAddForm>
            label="Aantal blokken"
            path="amountOfBlocks"
            control={control}
            type="number"
          />
          <Button
            name="Opslaan"
            color="primary"
            type="submit"
            classNames="mt-5"
            disabled={!isValid}
          />
        </form>
      </FormProvider>
    </div>
  );
}
