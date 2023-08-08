import { array, mixed, number, object } from "yup";
import { BootTypes } from "../models/settings";

export const typesFormSchema = object({
  items: array()
    .of(
      object({
        type: mixed<BootTypes>().oneOf(Object.values(BootTypes)).required(),
        correction: number().required(),
        price: number().required(),
      }).required()
    )
    .required(),
});
