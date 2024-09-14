import { array, mixed, number, object } from 'yup';
import { BoatType } from '@models';

export const typesFormSchema = object({
  items: array()
    .of(
      object({
        type: mixed<BoatType>().oneOf(Object.values(BoatType)).required(),
        correction: number()
          .transform((_value, originalValue) =>
            Number(originalValue.toString().replace(/,/, '.'))
          )
          .required(),
        price: number()
          .transform((_value, originalValue) =>
            Number(originalValue.toString().replace(/,/, '.'))
          )
          .required(),
      }).required()
    )
    .required(),
});
