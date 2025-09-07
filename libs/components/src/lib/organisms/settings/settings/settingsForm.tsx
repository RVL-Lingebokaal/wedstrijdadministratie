'use client';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  DatePicker,
  IconButton,
  InputController,
} from '@components/server';
import { SettingForm, settingFormSchema } from '@schemas';
import { useSaveGeneralSettings } from '@hooks';
import { SettingData } from '@models';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';

export function SettingsForm({ initialData }: { initialData: SettingData }) {
  const { mutate, isLoading } = useSaveGeneralSettings();
  const {
    handleSubmit,
    control,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<SettingForm>({
    defaultValues: {
      ...initialData,
      missingNumbers: initialData.missingNumbers?.map((value) => ({ value })),
      currentNumber: undefined,
    },
    resolver: zodResolver(settingFormSchema),
  });
  const onSubmit = (values: SettingForm) => {
    const missingNumbers = values.missingNumbers.map((value) => value.value);
    void mutate({ ...values, missingNumbers });
  };
  const { append, fields, remove } = useFieldArray({
    name: 'missingNumbers',
    control,
  });

  return (
    <div className="w-full flex">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="mx-4 flex w-full">
          <div className="grid grid-cols-2 gap-4">
            <div className="self-center">
              <p className="font-bold text-xl">Wedstrijddatum</p>
            </div>
            <div>
              <DatePicker path="date" control={control} />
            </div>
            <div>
              <p className="font-bold text-xl">Missende startnummers</p>
            </div>
            <div>
              {fields.map((field, index) => (
                <div className="flex gap-4">
                  <InputController
                    key={field.id}
                    path={`missingNumbers.${index}.value`}
                    control={control}
                  />
                  <IconButton
                    icon={<FaMinus color="#0E294B" />}
                    type="button"
                    onClick={() => remove(index)}
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <InputController path="currentNumber" control={control} />
                <IconButton
                  type="button"
                  icon={<FaPlus color="#0E294B" />}
                  onClick={() => {
                    const currentNumber = getValues('currentNumber');
                    if (currentNumber) {
                      append({ value: currentNumber });
                      setValue('currentNumber', undefined);
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Button
                name="Opslaan"
                color="highlight"
                type="submit"
                classNames="mt-8"
                disabled={!isValid}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
