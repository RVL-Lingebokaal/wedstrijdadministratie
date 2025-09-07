import { ageStrategies, ageTypes } from '@models';
import { z } from 'zod';

export const ageFormSchema = z.object({
  items: z
    .array(
      z.object({
        type: z.enum(ageTypes),
        age: z.string(),
        correctionMale: z
          .number()
          .transform((_, originalValue) =>
            Number(originalValue.toString().replace(/,/, '.'))
          ),
        correctionFemale: z
          .number()
          .transform((_, originalValue) =>
            Number(originalValue.toString().replace(/,/, '.'))
          ),
        strategy: z.enum(ageStrategies),
      })
    )
    .min(1),
});
