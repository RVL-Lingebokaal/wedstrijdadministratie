import { object, string } from "yup";

export const groupingClassSchema = object({
  name: string().required(),
});
