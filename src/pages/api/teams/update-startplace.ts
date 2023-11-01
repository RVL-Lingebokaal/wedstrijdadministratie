import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";
import { Team } from "../../../models/team";

export interface UpdateStartPlaceArgs {
  startPlaceDict: { id: string; startPlace: number }[];
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

  const { startPlaceDict } = JSON.parse(req.body) as UpdateStartPlaceArgs;
  const teams: Team[] = [];
  await Promise.all(
    startPlaceDict.map(async ({ id, startPlace }) => {
      const team = await teamService.getTeam(id);

      if (!team) {
        return res
          .status(500)
          .json({ error: "Er bestaat geen team met dit ID" });
      }

      team.setStartPlace(startPlace);
      teams.push(team);
    })
  );

  await teamService.saveTeams(teams);

  return res.status(200).send({ success: true });
}
