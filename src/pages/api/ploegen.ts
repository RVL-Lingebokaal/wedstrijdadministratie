import { collection, getDocs } from "firebase/firestore";
import firestore from "../../firebase/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Ploeg } from "../../models/ploeg";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Ploeg[]>
) {
  const dbInstance = collection(firestore, "ploeg");
  const data = await getDocs(dbInstance);
  const ploegen = data.docs.map((doc) => new Ploeg(doc.data().naam));
  res.status(200).json(ploegen);
}
