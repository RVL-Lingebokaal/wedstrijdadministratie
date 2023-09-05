import { Team } from "../../models/team";
import { AgeItem, AgeTypes } from "../../models/settings";

export function getGroups(teams: Team[]) {
  return teams.reduce((acc, team) => {
    const boatType = team.getBoatType();
    if (!boatType) {
      throw new Error("missing boattype in boat");
    }
    let teams: Team[] = [];
    if (acc.has(boatType)) {
      teams = acc.get(boatType) ?? [];
    }
    teams.push(team);
    return acc.set(boatType, teams);
  }, new Map<string, Team[]>());
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
  }, new Map<AgeTypes, Team[]>());
}
