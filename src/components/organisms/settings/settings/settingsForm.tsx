import { useForm } from "react-hook-form";
import DatePicker from "../../../molecules/date-picker/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { settingFormSchema } from "../../../../schemas/settingFormSchema";
import { Button } from "../../../atoms/button/button";
import { useSaveGeneralSettings } from "../../../../hooks/settings/useSaveGeneralSettings";
import { useGetGeneralSettings } from "../../../../hooks/settings/useGetGeneralSettings";
import { useEffect } from "react";

interface SettingForm {
  date: string;
}

export function SettingsForm() {
  const { data, isLoading: dataIsLoading } = useGetGeneralSettings();
  const { mutate, isLoading } = useSaveGeneralSettings();
  const {
    handleSubmit,
    control,
    formState: { isValid },
    setValue,
  } = useForm<SettingForm>({
    defaultValues: { date: data?.date || "" },
    resolver: yupResolver(settingFormSchema),
  });

  const onSubmit = (values: SettingForm) => {
    void mutate(values);
  };

  useEffect(() => {
    if (!dataIsLoading) {
      setValue("date", data?.date || "");
    }
  }, [data?.date, dataIsLoading, setValue]);

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
