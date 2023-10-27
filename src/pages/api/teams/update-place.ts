import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";
import { Team } from "../../../models/team";

export interface UpdatePlaceArgs {
  teamsWithPlace: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(500)
      .json({ error: "Alleen POST methodes zijn toegestaan" });
  }

  const { teamsWithPlace } = JSON.parse(req.body) as UpdatePlaceArgs;
  const teams: Team[] = [];
  await Promise.all(
    teamsWithPlace.map(async (teamId, index) => {
      const team = await teamService.getTeam(teamId);

      if (!team) {
        return res
          .status(500)
          .json({ error: "Er bestaat geen team met dit ID" });
      }

      team.setPlace(index);
      teams.push(team);
    })
  );

  await teamService.saveTeams(teams);

  return res.status(200).send({ success: true });
}
