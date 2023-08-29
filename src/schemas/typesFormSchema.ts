import { array, mixed, number, object } from "yup";
import { BoatTypes } from "../models/settings";

export const typesFormSchema = object({
  items: array()
    .of(
      object({
        type: mixed<BoatTypes>().oneOf(Object.values(BoatTypes)).required(),
        correction: number().required(),
        price: number().required(),
      }).required()
    )
    .required(),
});
