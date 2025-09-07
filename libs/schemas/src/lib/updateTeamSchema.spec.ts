import { updateTeamSchema } from './updateTeamSchema';

describe('updateTeamSchema', () => {
  it('validates a correct scheme', () => {
    const result = updateTeamSchema.safeParse({
      team: 'team',
      name: 'name',
      club: 'club',
      participants: [],
      boat: 'boat',
      preferredBlock: 1,
      boatType: '1x',
      helm: null,
      gender: 'male',
    });

    expect(result.success).toEqual(true);
  });

  it('throws an error, because of missing team name', () => {
    const result = updateTeamSchema.safeParse({
      name: 'name',
      club: 'club',
      participants: [],
      boat: 'boat',
      preferredBlock: 1,
      boatType: '1x',
      helm: null,
      gender: 'male',
    });

    expect(result.error?.message).toContain(
      'expected string, received undefined'
    );
  });
});
