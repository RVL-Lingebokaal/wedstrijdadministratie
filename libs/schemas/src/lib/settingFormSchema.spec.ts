import { settingFormSchema } from './settingFormSchema';

describe('settingFormSchema', () => {
  it('validates a correct schema', () => {
    const result = settingFormSchema.safeParse({
      date: '01-01-1999',
      missingNumbers: [{ value: 10 }],
    });

    expect(result.success).toBe(true);
  });

  it('throws an error, because of missing date', () => {
    const result = settingFormSchema.safeParse({
      data: '',
      missingNumbers: [{ value: 10 }],
    });

    expect(result.error?.message).toContain(
      'Invalid input: expected string, received undefined'
    );
  });

  it('throws an error, because of missing missingNumbers', () => {
    const result = settingFormSchema.safeParse({
      data: '01-01-1999',
      missingNumbers: undefined,
    });

    expect(result.error?.message).toContain(
      'Invalid input: expected string, received undefined'
    );
  });
});
