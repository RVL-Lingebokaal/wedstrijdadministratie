'use client';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Button,
  DatePicker,
  InputController,
  TextAreaController,
} from '@components/server';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useCreateWedstrijd } from '@hooks';
import { BasicWedstrijdInfo, basicWedstrijdInfoSchema } from '@models';

export default function CreateWedstrijd() {
  const { mutate } = useCreateWedstrijd();

  const methods = useForm<BasicWedstrijdInfo>({
    resolver: zodResolver(basicWedstrijdInfoSchema),
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
    async (values: BasicWedstrijdInfo) => {
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
          <InputController<BasicWedstrijdInfo>
            label="Naam van de wedstrijd"
            path="name"
            control={control}
          />
          <DatePicker<BasicWedstrijdInfo>
            path="date"
            control={control}
            label="Datum wedstrijd"
          />
          <TextAreaController<BasicWedstrijdInfo>
            label="Omschrijving van de wedstrijd"
            path="description"
            control={control}
          />
          <InputController<BasicWedstrijdInfo>
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
