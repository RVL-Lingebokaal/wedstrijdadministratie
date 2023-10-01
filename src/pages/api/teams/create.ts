import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../../services/teamService.server";
import { TeamAddForm } from "../../../components/organisms/team/team-add-button/teamAddButton";
import { Team } from "../../../models/team";
import { Boat } from "../../../models/boat";
import { Participant } from "../../../models/participant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(500).json({ error: "Alleen POST methodes mogen" });
  }

  const args = JSON.parse(req.body) as TeamAddForm;
  const team = new Team({
    name: args.name,
    id: Math.floor(Math.random() * 10000 + 1).toString(),
    club: args.club,
    boat: new Boat({ name: args.boat, club: args.club }),
    registrationFee: 0,
    preferredBlock: args.preferredBlock,
    coach: "",
    phoneNumber: "",
    remarks: "",
    boatType: args.boatType,
    gender: args.gender,
    helm: args.helm
      ? new Participant({
          name: args.helm.name,
          club: args.helm.club,
          birthYear: args.helm.birthYear,
          id: Math.floor(Math.random() * 1000000 + 1).toString(),
        })
      : null,
    participants: args.participants.map(
      ({ name, club, birthYear }) =>
        new Participant({
          name,
          club,
          birthYear,
          id: Math.floor(Math.random() * 1000000 + 1).toString(),
        })
    ),
  });

  await teamService.saveTeam(team);
  return res.status(200).send({ success: true });
}
