import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";
import { BlockError } from "../../../models/error";
import boatService from "../../../services/boatService.server";

export interface UpdateBlockArgs {
  teamId: string;
  destBlock: number;
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

  const args = JSON.parse(req.body) as UpdateBlockArgs;
  const team = await teamService.getTeam(args.teamId);
  if (!team) {
    return res.status(500).json({ error: "Er bestaat geen team met dit ID" });
  }

  try {
    team.setPreferredBlock(args.destBlock);
    await teamService.saveTeam(team);
  } catch (error: any) {
    let errorMessage;
    switch (error.name) {
      case "PARTICIPANT_BLOCK":
        errorMessage = `Een van de deelnemers roeit of stuurt al in blok ${args.destBlock}.`;
        break;
      case "HELM_BLOCK":
        errorMessage = `De stuur roeit of stuurt al in blok ${args.destBlock}.`;
        break;
      case "BOAT_BLOCK":
        errorMessage = `De boot wordt al gebruikt in blok ${args.destBlock}.`;
        break;
    }

    if (errorMessage) {
      return res.status(200).json({ errorMessage });
    }

    return res.status(500).json({
      errorMessage: "Er is een probleem met het updaten van dit team.",
    });
  }

  return res.status(200).send({ success: true });
}
