import { addTeamSchema } from './addTeamSchema';
import { BoatType, Gender } from '@models';

const mockTeam = {
  name: 'name',
  club: 'club',
  participants: [],
  boat: 'boat',
  preferredBlock: 1,
  boatType: BoatType.skiff,
  helm: null,
  gender: Gender.M,
};

describe('addTeamSchema', () => {
  it('validates a scheme', () =>
    expect(addTeamSchema.validate(mockTeam)).resolves.not.toThrow());

  it('validates a scheme with a helm', () =>
    expect(
      addTeamSchema.validate({
        ...mockTeam,
        helm: { name: 'name', club: 'club', birthYear: 1900 },
      })
    ).resolves.not.toThrow());

  it('validates a scheme with participants', () =>
    expect(
      addTeamSchema.validate({
        ...mockTeam,
        participants: [{ name: 'name', club: 'club', birthYear: 1900 }],
      })
    ).resolves.not.toThrow());

  it.each([
    {
      missing: 'name',
      el: { ...mockTeam, name: undefined },
      error: 'name is a required field',
    },
    {
      missing: 'club',
      el: { ...mockTeam, club: undefined },
      error: 'club is a required field',
    },
    {
      missing: 'boat',
      el: { ...mockTeam, boat: undefined },
      error: 'boat is a required field',
    },
    {
      missing: 'participants',
      el: { ...mockTeam, participants: undefined },
      error: 'participants is a required field',
    },
    {
      missing: 'preferredBlock',
      el: { ...mockTeam, preferredBlock: undefined },
      error: 'preferredBlock is a required field',
    },
    {
      missing: 'boatType',
      el: { ...mockTeam, boatType: undefined },
      error: 'boatType is a required field',
    },
    {
      missing: 'gender',
      el: {
        ...mockTeam,
        gender: undefined,
        error: 'gender is a required field',
      },
    },
  ])('throws an error, because of missing $missing', ({ el, error }) =>
    expect(addTeamSchema.validate(el)).rejects.toThrow(error)
  );

  it('throws an error, because the gender is wrong', () =>
    expect(
      addTeamSchema.validate({ ...mockTeam, gender: '1' })
    ).rejects.toThrow(
      'gender must be one of the following values: male, female, mix'
    ));

  it('throws an error, because the preferredBlock is wrong', () =>
    expect(
      addTeamSchema.validate({ ...mockTeam, preferredBlock: 4 })
    ).rejects.toThrow('preferredBlock must be less than or equal to 3'));

  it('throws an error, because the boatType is wrong', () =>
    expect(
      addTeamSchema.validate({ ...mockTeam, boatType: '1' })
    ).rejects.toThrow(
      'boatType must be one of the following values: 4*, 4x-, C4*, C4+, 4-, 4+, 8*, 8+, 2-, 2x, 1x'
    ));

  it.each([
    {
      missing: 'name',
      el: { ...mockTeam, helm: { birthYear: 1900, club: 'club' } },
      error: 'helm.name is a required field',
    },
    {
      missing: 'club',
      el: { ...mockTeam, helm: { birthYear: 1900, name: 'name' } },
      error: 'helm.club is a required field',
    },
    {
      missing: 'birthYear',
      el: { ...mockTeam, helm: { name: 'name', club: 'club' } },
      error: 'helm.birthYear is a required field',
    },
  ])('throws an error, because of missing $missing in helm', ({ el, error }) =>
    expect(addTeamSchema.validate(el)).rejects.toThrow(error)
  );

  it.each([
    {
      missing: 'name',
      el: { ...mockTeam, participants: [{ club: 'club', birthYear: 1900 }] },
      error: 'participants[0].name is a required field',
    },
    {
      missing: 'club',
      el: { ...mockTeam, participants: [{ name: 'name', birthYear: 1900 }] },
      error: 'participants[0].club is a required field',
    },
    {
      missing: 'birthYear',
      el: { ...mockTeam, participants: [{ name: 'name', club: 'club' }] },
      error: 'participants[0].birthYear is a required field',
    },
  ])(
    'throws an error, because of missing $missing in participant',
    ({ el, error }) => expect(addTeamSchema.validate(el)).rejects.toThrow(error)
  );
});
