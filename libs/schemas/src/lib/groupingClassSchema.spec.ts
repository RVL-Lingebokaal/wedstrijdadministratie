import { groupingClassSchema } from './groupingClassSchema';

describe('groupingClassSchema', () => {
  it('validates the scheme', () => {
    const result = groupingClassSchema.safeParse({ name: 'name' });

    expect(result.success).toBe(true);
  });

  it('throws an error, because of missing name', () => {
    const result = groupingClassSchema.safeParse({});

    expect(result.error?.message).toContain(
      'Invalid input: expected string, received undefined'
    );
  });
});
