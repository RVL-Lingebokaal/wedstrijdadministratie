import { object, string } from "yup";

export const settingFormSchema = object({
  date: string().required(),
});
