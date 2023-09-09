import { array, mixed, number, object } from "yup";
import { BoatType } from "../models/settings";

export const typesFormSchema = object({
  items: array()
    .of(
      object({
        type: mixed<BoatType>().oneOf(Object.values(BoatType)).required(),
        correction: number().required(),
        price: number().required(),
      }).required()
    )
    .required(),
});
