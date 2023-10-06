import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";
import { TeamAddForm } from "../../../components/organisms/team/team-add-button/teamAddButton";
import { Team } from "../../../models/team";
import { Boat } from "../../../models/boat";
import participantService from "../../../services/participantService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Alleen POST methodes mogen" });
  }

  const args = JSON.parse(req.body) as TeamAddForm;
  const helm = args.helm
    ? await participantService.createParticipant({ ...args.helm })
    : null;
  const participants = [];
  for await (const p of args.participants) {
    const participant = await participantService.createParticipant(p);
    participants.push(participant);
  }
  const team = new Team({
    name: args.name,
    id: teamService.generateId().toString(),
    club: args.club,
    boat: new Boat({ name: args.boat, club: args.club }),
    registrationFee: 0,
    preferredBlock: args.preferredBlock,
    coach: "",
    phoneNumber: "",
    remarks: "",
    boatType: args.boatType,
    gender: args.gender,
    helm,
    participants,
  });

  await teamService.saveTeam(team);
  return res.status(200).send({ success: true });
}
