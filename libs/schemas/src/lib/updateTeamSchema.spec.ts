import { updateTeamSchema } from './updateTeamSchema';
import { BoatType, Gender } from '@models';

describe('updateTeamSchema', () => {
  it('validates a correct scheme', () =>
    expect(
      updateTeamSchema.validate({
        team: 'team',
        name: 'name',
        club: 'club',
        participants: [],
        boat: 'boat',
        preferredBlock: 1,
        boatType: BoatType.skiff,
        helm: null,
        gender: Gender.M,
      })
    ).resolves.not.toThrow());

  it('throws an error, because of missing team name', () =>
    expect(
      updateTeamSchema.validate({
        name: 'name',
        club: 'club',
        participants: [],
        boat: 'boat',
        preferredBlock: 1,
        boatType: BoatType.skiff,
        helm: null,
        gender: Gender.M,
      })
    ).rejects.toThrow('team is a required field'));
});
