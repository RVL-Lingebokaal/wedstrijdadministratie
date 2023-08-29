import { collection, getDocs } from "firebase/firestore";
import firestore from "../../firebase/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Team } from "../../models/team";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Team[]>
) {
  const dbInstance = collection(firestore, "ploeg");
  const data = await getDocs(dbInstance);
  const teams = data.docs.map((doc) => new Team(doc.data().naam));
  res.status(200).json(teams);
}
