import { ageFormSchema } from './ageFormSchema';
import { AgeStrategy, AgeType } from '@models';

const mockAge = {
  type: AgeType.eighteen,
  age: '18',
  correctionMale: '1',
  correctionFemale: '1',
  strategy: AgeStrategy.average,
};
describe('ageFormSchema', () => {
  it('validates a scheme', () =>
    expect(ageFormSchema.validate({ items: [] })).resolves.not.toThrow());

  it('validates a scheme with items', () =>
    expect(
      ageFormSchema.validate({ items: [mockAge] })
    ).resolves.not.toThrow());

  it.each([
    {
      missing: 'type',
      el: { ...mockAge, type: undefined },
      error: 'type is a required field',
    },
    {
      missing: 'age',
      el: { ...mockAge, age: undefined },
      error: 'age is a required field',
    },
    {
      missing: 'correctionMale',
      el: { ...mockAge, correctionMale: undefined },
      error: 'correctionMale is a required field',
    },
    {
      missing: 'correctionFemale',
      el: { ...mockAge, correctionFemale: undefined },
      error: 'correctionFemale is a required field',
    },
    { missing: 'strategy', el: { ...mockAge, strategy: undefined } },
  ])('throws an error, because of missing $missing', ({ el, error }) =>
    expect(ageFormSchema.validate({ items: [el] })).rejects.toThrow(error)
  );

  it('throws an error, because type is wrong', () =>
    expect(
      ageFormSchema.validate({ items: [{ ...mockAge, type: 'type' }] })
    ).rejects.toThrow(
      'items[0].type must be one of the following values: 14, 16, 18, -, VA, VB, VC, VD, VE, VF, VG, VH, VI, VJ, VK'
    ));

  it('throws an error, because strategy is wrong', () =>
    expect(
      ageFormSchema.validate({ items: [{ ...mockAge, strategy: 'strategy' }] })
    ).rejects.toThrow(
      'items[0].strategy must be one of the following values: oudste, gemiddeld, jongste'
    ));

  it('throws an error, because correctionMale is not a number', () =>
    expect(
      ageFormSchema.validate({
        items: [{ ...mockAge, correctionMale: 'correctionMale' }],
      })
    ).rejects.toThrow(
      'items[0].correctionMale must be a `number` type, but the final value was: `NaN` (cast from the value `"correctionMale"`).'
    ));

  it('throws an error, because correctionFemale is not a number', () =>
    expect(
      ageFormSchema.validate({
        items: [{ ...mockAge, correctionFemale: 'correctionFemale' }],
      })
    ).rejects.toThrow(
      'items[0].correctionFemale must be a `number` type, but the final value was: `NaN` (cast from the value `"correctionFemale"`).'
    ));

  it('throws an error, because there are no items', () =>
    expect(ageFormSchema.validate({ items: undefined })).rejects.toThrow(
      'items is a required field'
    ));
});
