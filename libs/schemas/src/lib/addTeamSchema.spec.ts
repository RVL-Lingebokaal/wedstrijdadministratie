import { addTeamSchema } from './addTeamSchema';

const mockTeam = {
  name: 'name',
  club: 'club',
  participants: [{ name: 'name', club: 'club', birthYear: 1900 }],
  boat: 'boat',
  preferredBlock: 1,
  boatType: '1x',
  helm: null,
  gender: 'male',
};

describe('addTeamSchema', () => {
  it('validates a scheme', () => {
    const result = addTeamSchema.safeParse(mockTeam);

    expect(result.success).toBe(true);
  });

  it('validates a scheme with a helm', () => {
    const result = addTeamSchema.safeParse({
      ...mockTeam,
      helm: { name: 'name', club: 'club', birthYear: 1900 },
    });

    expect(result.success).toBe(true);
  });

  it('validates a scheme with participants', () => {
    const result = addTeamSchema.safeParse({
      ...mockTeam,
      participants: [{ name: 'name', club: 'club', birthYear: 1900 }],
    });

    expect(result.success).toBe(true);
  });

  it.each([
    {
      missing: 'name',
      el: { ...mockTeam, name: undefined },
      error: 'expected string, received undefined',
    },
    {
      missing: 'club',
      el: { ...mockTeam, club: undefined },
      error: 'expected string, received undefined',
    },
    {
      missing: 'boat',
      el: { ...mockTeam, boat: undefined },
      error: 'expected string, received undefined',
    },
    {
      missing: 'participants',
      el: { ...mockTeam, participants: undefined },
      error: 'expected array, received undefined',
    },
    {
      missing: 'preferredBlock',
      el: { ...mockTeam, preferredBlock: undefined },
      error: 'expected number, received undefined',
    },
  ])('throws an error, because of missing $missing', ({ el, error }) => {
    const result = addTeamSchema.safeParse(el);

    expect(result.error?.message).toContain(error);
  });

  it('throws an error, because the gender is wrong', () => {
    const result = addTeamSchema.safeParse({ ...mockTeam, gender: '1' });

    expect(result.error?.message).toContain(
      'Invalid option: expected one of \\"male\\"|\\"mix\\"|\\"female\\"|\\"open\\"'
    );
  });

  it('throws an error, because the preferredBlock is wrong', () => {
    const result = addTeamSchema.safeParse({ ...mockTeam, preferredBlock: 4 });

    expect(result.error?.message).toContain(
      'Too big: expected number to be <=3'
    );
  });

  it('throws an error, because the boatType is wrong', () => {
    const result = addTeamSchema.safeParse({ ...mockTeam, boatType: '1' });

    expect(result.error?.message).toContain(
      'Invalid option: expected one of \\"8+\\"|\\"8*\\"|\\"4*\\"|\\"4+\\"|\\"4-\\"|\\"4x-\\"|\\"2-\\"|\\"2x\\"|\\"1x\\"|\\"C4*\\"|\\"C4+\\"|\\"C3x\\"'
    );
  });

  it.each([
    {
      missing: 'name',
      el: { ...mockTeam, helm: { birthYear: 1900, club: 'club' } },
      error: 'expected string, received undefined',
    },
    {
      missing: 'club',
      el: { ...mockTeam, helm: { birthYear: 1900, name: 'name' } },
      error: 'expected string, received undefined',
    },
    {
      missing: 'birthYear',
      el: { ...mockTeam, helm: { name: 'name', club: 'club' } },
      error: 'expected number, received undefined',
    },
  ])(
    'throws an error, because of missing $missing in helm',
    ({ el, error }) => {
      const result = addTeamSchema.safeParse(el);

      expect(result.error?.message).toContain(error);
    }
  );

  it.each([
    {
      missing: 'name',
      el: { ...mockTeam, participants: [{ club: 'club', birthYear: 1900 }] },
      error: 'expected string, received undefined',
    },
    {
      missing: 'club',
      el: { ...mockTeam, participants: [{ name: 'name', birthYear: 1900 }] },
      error: 'expected string, received undefined',
    },
    {
      missing: 'birthYear',
      el: { ...mockTeam, participants: [{ name: 'name', club: 'club' }] },
      error: 'expected number, received undefined',
    },
  ])(
    'throws an error, because of missing $missing in participant',
    ({ el, error }) => {
      const result = addTeamSchema.safeParse(el);

      expect(result.error?.message).toContain(error);
    }
  );
});
