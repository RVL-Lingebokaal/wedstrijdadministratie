'use client';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import {
  Button,
  DatePicker,
  IconButton,
  InputController,
} from '@components/server';
import { SettingForm, settingFormSchema } from '@schemas';
import { useSaveGeneralSettings } from '@hooks';
import { SettingData, WedstrijdIdProps } from '@models';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroupController } from '../../../atoms/radio-group/radioGroupController';

interface SettingsFormProps extends WedstrijdIdProps {
  initialData: SettingData;
  wedstrijdId: string;
}

export function SettingsForm({ initialData, wedstrijdId }: SettingsFormProps) {
  const { mutate, isLoading } = useSaveGeneralSettings({ wedstrijdId });
  const methods = useForm<SettingForm>({
    defaultValues: {
      ...initialData,
      missingNumbers: initialData.missingNumbers?.map((value) => ({ value })),
      currentNumber: undefined,
    },
    resolver: zodResolver(settingFormSchema),
  });
  const {
    handleSubmit,
    control,
    formState: { isValid },
    getValues,
    setValue,
  } = methods;
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
      <FormProvider {...methods}>
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
                <p className="font-bold text-xl">Is dit een jeugdwedstrijd?</p>
              </div>
              <div>
                <RadioGroupController<SettingForm, boolean>
                  path="isJeugd"
                  items={[
                    { label: 'Ja', value: true },
                    { label: 'Nee', value: false },
                  ]}
                />
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
                      type="number"
                    />
                    <IconButton
                      icon={<FaMinus color="#0E294B" />}
                      type="button"
                      onClick={() => remove(index)}
                    />
                  </div>
                ))}
                <div className="flex gap-4">
                  <InputController
                    path="currentNumber"
                    control={control}
                    type="number"
                  />
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
      </FormProvider>
    </div>
  );
}
