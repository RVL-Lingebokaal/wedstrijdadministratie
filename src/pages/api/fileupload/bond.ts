import { NextApiRequest, NextApiResponse } from "next";
import { bondService } from "../../../services/bondService.server";
import Busboy from "busboy";
import { Stream } from "stream";
import { teamService } from "../../../services/teamService.server";
import { participantService } from "../../../services/participantService.server";
import { boatService } from "../../../services/boatService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const busBoy = Busboy({ headers: req.headers });
      busBoy.on("file", async function (_, stream: Stream) {
        const { teams, participants, boats } = await bondService.readBondFile(
          stream
        );
        await teamService.saveTeams(teams);
        await participantService.saveParticipants(participants);
        await boatService.saveBoats(boats);
        res.json({ count: teams.length });
      });
      busBoy.on("close", () => {
        res.status(200);
      });
      req.pipe(busBoy);
    } catch (e) {
      console.error(e);
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
