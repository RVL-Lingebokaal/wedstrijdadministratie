import { ageFormSchema } from './ageFormSchema';

const mockAge = {
  type: '18',
  age: '18',
  correctionMale: 1,
  correctionFemale: 1,
  strategy: 'gemiddeld',
};
describe('ageFormSchema', () => {
  it('validates a scheme', () => {
    const result = ageFormSchema.safeParse({ items: [mockAge] });

    expect(result.success).toBe(true);
  });

  it.each([
    {
      missing: 'type',
      el: { ...mockAge, type: undefined },
      error:
        'Invalid option: expected one of \\"14\\"|\\"16\\"|\\"18\\"|\\"-\\"|\\"VA\\"|\\"VB\\"|\\"VC\\"|\\"VD\\"|\\"VE\\"|\\"VF\\"|\\"VG\\"|\\"VH\\"|\\"VI\\"|\\"VJ\\"|\\"VK\\',
    },
    {
      missing: 'age',
      el: { ...mockAge, age: undefined },
      error: 'expected string, received undefined',
    },
    {
      missing: 'correctionMale',
      el: { ...mockAge, correctionMale: undefined },
      error: 'expected number, received undefined',
    },
    {
      missing: 'correctionFemale',
      el: { ...mockAge, correctionFemale: undefined },
      error: 'expected number, received undefined',
    },
    {
      missing: 'strategy',
      el: { ...mockAge, strategy: undefined },
      error:
        'Invalid option: expected one of \\"oudste\\"|\\"gemiddeld\\"|\\"jongste\\"',
    },
  ])('throws an error, because of missing $missing', ({ el, error }) => {
    const result = ageFormSchema.safeParse({ items: [el] });

    expect(result.error?.message).toContain(error);
  });

  it('throws an error, because type is wrong', () => {
    const result = ageFormSchema.safeParse({
      items: [{ ...mockAge, type: 'type' }],
    });

    expect(result.error?.message).toContain(
      'Invalid option: expected one of \\"14\\"|\\"16\\"|\\"18\\"|\\"-\\"|\\"VA\\"|\\"VB\\"|\\"VC\\"|\\"VD\\"|\\"VE\\"|\\"VF\\"|\\"VG\\"|\\"VH\\"|\\"VI\\"|\\"VJ\\"|\\"VK\\'
    );
  });

  it('throws an error, because strategy is wrong', () => {
    const result = ageFormSchema.safeParse({
      items: [{ ...mockAge, strategy: 'strategy' }],
    });

    expect(result.error?.message).toContain(
      'Invalid option: expected one of \\"oudste\\"|\\"gemiddeld\\"|\\"jongste\\"'
    );
  });

  it('throws an error, because correctionMale is not a number', () => {
    const result = ageFormSchema.safeParse({
      items: [{ ...mockAge, correctionMale: 'correctionMale' }],
    });

    expect(result.error?.message).toContain('expected number, received string');
  });

  it('throws an error, because correctionFemale is not a number', () => {
    const result = ageFormSchema.safeParse({
      items: [{ ...mockAge, correctionFemale: 'correctionFemale' }],
    });

    expect(result.error?.message).toContain('expected number, received string');
  });

  it('throws an error, because there are no items', () => {
    const result = ageFormSchema.safeParse({ items: [] });

    expect(result.error?.message).toContain(
      'Too small: expected array to have >=1 items'
    );
  });
});
