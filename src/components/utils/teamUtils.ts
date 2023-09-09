import { Gender, Team } from "../../models/team";
import { AgeItem, AgeType, BoatType } from "../../models/settings";

export function getGroups(teams: Team[], gender: Gender) {
  return teams.reduce((acc, team) => {
    const boatType = team.getBoatType();
    if (!boatType) {
      throw new Error("missing boattype in boat");
    }
    if (team.getGender() !== gender) {
      return acc;
    }
    let teams: Team[] = [];
    if (acc.has(boatType)) {
      teams = acc.get(boatType) ?? [];
    }
    teams.push(team);
    return acc.set(boatType, teams);
  }, new Map<BoatType, Team[]>());
}

export function getTeamsByClass(teams: Team[], ages: AgeItem[]) {
  return teams.reduce((acc, team) => {
    const ageClass = team.getAgeClass(ages);
    let teams: Team[] = [];
    if (acc.has(ageClass)) {
      teams = acc.get(ageClass) ?? [];
    }
    teams.push(team);
    return acc.set(ageClass, teams);
  }, new Map<AgeType, Team[]>());
}
