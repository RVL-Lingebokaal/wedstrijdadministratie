import { array, number, object, string } from 'yup';

export const settingFormSchema = object({
  date: string().required(),
  missingNumbers: array()
    .of(object({ value: number().required() }).required())
    .required(),
});
