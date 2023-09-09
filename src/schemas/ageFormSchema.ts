import { array, mixed, number, object, string } from "yup";
import { AgeStrategy, AgeType } from "../models/settings";

export const ageFormSchema = object({
  items: array()
    .of(
      object({
        type: mixed<AgeType>().oneOf(Object.values(AgeType)).required(),
        age: string().required(),
        correctionMale: number().required(),
        correctionFemale: number().required(),
        strategy: mixed<AgeStrategy>()
          .oneOf(Object.values(AgeStrategy))
          .required(),
      })
    )
    .required(),
});
