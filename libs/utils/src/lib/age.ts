import { AgeItem, AgeType, ClassItem, getAgeClassTeam } from '@models';
import { GetTeamResult } from '@hooks';

export function calculateAgeType(ages: AgeItem[], ageToBeFound: number) {
  const type = ages.find(({ age }) => {
    const splittedAge = age.split('t/m');
    const lower = parseInt(splittedAge[0].trim());
    const high = parseInt(splittedAge[1].trim());
    return ageToBeFound >= lower && ageToBeFound <= high;
  })?.type;

  return type ?? AgeType.open;
}

export function allAgesAreProcessed(
  ages: AgeItem[],
  teams: GetTeamResult[],
  classes: ClassItem[]
) {
  const teamAges = teams.reduce(
    (set, team) =>
      set.add(
        JSON.stringify({
          age: getAgeClassTeam({ ages, participants: team.participants }),
          gender: team.gender,
          boatType: team.boatType,
        })
      ),
    new Set<string>()
  );
  classes.forEach((c) => {
    c.ages.forEach((age) => {
      const key = JSON.stringify({
        age,
        gender: c.gender,
        boatType: c.boatType,
      });
      teamAges.delete(key);
    });
  });

  return { processed: teamAges.size === 0, missing: teamAges.size };
}
