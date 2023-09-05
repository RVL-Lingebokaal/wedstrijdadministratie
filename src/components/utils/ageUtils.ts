import { AgeItem, AgeTypes } from "../../models/settings";

export function calculateAgeType(ages: AgeItem[], ageToBeFound: number) {
  const type = ages.find(({ age }) => {
    const splittedAge = age.split("t/m");
    const lower = parseInt(splittedAge[0].trim());
    const high = parseInt(splittedAge[1].trim());
    return ageToBeFound >= lower && ageToBeFound <= high;
  })?.type;

  return type ?? AgeTypes.open;
}
