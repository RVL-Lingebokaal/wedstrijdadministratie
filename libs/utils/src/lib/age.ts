import { AgeItem, AgeType, ClassItem, Team } from '@models';

export function calculateAgeType(ages: AgeItem[], ageToBeFound: number) {
  const type = ages.find(({ age }) => {
    const splittedAge = age.split('t/m');
    const lower = parseInt(splittedAge[0].trim());
    const high = parseInt(splittedAge[1].trim());

    return ageToBeFound >= lower && ageToBeFound < high + 1;
  })?.type;

  return type ?? AgeType.open;
}

export function allAgesAreProcessed(teams: Team[], classes: ClassItem[]) {
  const teamAges = teams.reduce(
    (set, team) =>
      set.add(
        JSON.stringify({
          age: team.ageClass,
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

  return {
    processed: teamAges.size === 0,
    missing: teamAges.size,
  };
}

export function getClassMap(classItems: ClassItem[]) {
  return classItems.reduce((map, c) => {
    c.ages.forEach((age) => {
      map.set(`${age}${c.gender}${c.boatType}`, c.name);
    });
    return map;
  }, new Map<string, string>());
}
