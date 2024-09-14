import { typesFormSchema } from './typesFormSchema';
import { BoatType } from '@models';

const mockTypeForm = {
  type: BoatType.skiff,
  correction: 1,
  price: 12,
};

describe('typesFormSchema', () => {
  it('validates a correct schema', () =>
    expect(
      typesFormSchema.validate({
        items: [mockTypeForm],
      })
    ).resolves.not.toThrow());

  test.each([
    {
      missing: 'type',
      el: { ...mockTypeForm, type: undefined },
      error: 'type is a required field',
    },
    {
      missing: 'correction',
      el: { ...mockTypeForm, correction: undefined },
      correction: 'type is a required field',
    },
    {
      missing: 'price',
      el: { ...mockTypeForm, price: undefined },
      error: 'price is a required field',
    },
  ])('throws an error, because of missing $missing', ({ el, error }) =>
    expect(typesFormSchema.validate({ items: [el] })).rejects.toThrow(error)
  );

  it('throws an error, because there are no items', () =>
    expect(typesFormSchema.validate({})).rejects.toThrow(
      'items is a required field'
    ));

  it('throws an error, because type is not correct', () =>
    expect(
      typesFormSchema.validate({ items: [{ ...mockTypeForm, type: 'type' }] })
    ).rejects.toThrow(
      'items[0].type must be one of the following values: 4*, 4x-, C4*, C4+, 4-, 4+, 8*, 8+, 2-, 2x, 1x'
    ));

  it('throws an error, because correction is not a number', () =>
    expect(
      typesFormSchema.validate({
        items: [{ ...mockTypeForm, correction: 'type' }],
      })
    ).rejects.toThrow(
      'items[0].correction must be a `number` type, but the final value was: `NaN` (cast from the value `"type"`).'
    ));

  it('throws an error, because price is not a number', () =>
    expect(
      typesFormSchema.validate({
        items: [{ ...mockTypeForm, price: 'type' }],
      })
    ).rejects.toThrow(
      'items[0].price must be a `number` type, but the final value was: `NaN` (cast from the value `"type"`).'
    ));
});
