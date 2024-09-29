export interface UpdateBlockArgs {
  teamId: string;
  destBlock: number;
}

export interface UpdatePlaceArgs {
  teamsWithPlace: string[];
}

export interface UseUpdateStartNumberTeam {
  id: string;
  startNumber: number;
}

export interface UseUpdateStartNumberTeamArgs {
  teams: UseUpdateStartNumberTeam[];
}
