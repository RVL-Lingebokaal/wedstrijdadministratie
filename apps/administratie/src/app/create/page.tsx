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
import { CreateWedstrijdForm, createWedstrijdFormSchema } from '@models';
import { RadioGroupController } from '@components';

export default function CreateWedstrijd() {
  const { mutate } = useCreateWedstrijd();

  const methods = useForm<CreateWedstrijdForm>({
    resolver: zodResolver(createWedstrijdFormSchema),
    defaultValues: {
      name: '',
      description: '',
      date: DateTime.now().toISODate(),
      amountOfBlocks: 1,
      isJeugd: false,
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = methods;

  const onSubmit = useCallback(
    async (values: CreateWedstrijdForm) => {
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
          <InputController<CreateWedstrijdForm>
            label="Naam van de wedstrijd"
            path="name"
            control={control}
          />
          <DatePicker<CreateWedstrijdForm>
            path="date"
            control={control}
            label="Datum wedstrijd"
          />
          <TextAreaController<CreateWedstrijdForm>
            label="Omschrijving van de wedstrijd"
            path="description"
            control={control}
          />
          <InputController<CreateWedstrijdForm>
            label="Aantal blokken"
            path="amountOfBlocks"
            control={control}
            type="number"
          />
          <div className="mt-2">
            <h4 className="font-bold mb-1">Is dit een jeugdwedstrijd?</h4>
            <RadioGroupController<CreateWedstrijdForm, boolean>
              path="isJeugd"
              items={[
                { label: 'Ja', value: true },
                { label: 'Nee', value: false },
              ]}
            />
          </div>
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
