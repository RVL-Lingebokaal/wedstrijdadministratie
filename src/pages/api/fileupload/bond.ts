import { NextApiRequest, NextApiResponse } from "next";
import { bondService } from "../../../services/bondService.server";
import Busboy from "busboy";
import { Stream } from "stream";
import teamService from "../../../services/teamService.server";
import participantService from "../../../services/participantService.server";
import boatService from "../../../services/boatService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(500).json({ error: "Alleen POST methodes mogen" });
  }

  try {
    const busBoy = Busboy({ headers: req.headers });
    busBoy.on("file", async function (_, stream: Stream) {
      await teamService.removeAllTeams();
      await participantService.removeAllParticipants();
      await boatService.removeAllBoats();

      const { teams, participants, boats } = await bondService.readBondFile(
        stream
      );

      await teamService.saveTeams(teams);
      await participantService.saveParticipants(participants);
      await boatService.saveBoats(boats);
    });
    busBoy.on("close", () => console.log("done processing"));
    req.pipe(busBoy);
  } catch (e) {
    console.error(e);
  }

  return res.status(200).send({ success: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
