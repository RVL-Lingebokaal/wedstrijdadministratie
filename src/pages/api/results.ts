import { NextApiRequest, NextApiResponse } from "next";
import teamService from "../../services/teamService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const result = await teamService.getResults();

    return res.status(200).send(result);
  }
}
