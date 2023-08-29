import { Boat } from "../models/boat";
import { doc, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";

export class BoatService {
  async saveBoats(boats: Boat[]) {
    const batch = writeBatch(firestore);

    boats.forEach((boat) => {
      const docRef = doc(firestore, "boot", boat.getId());
      batch.set(docRef, boat.getDatabaseBoat(), { merge: true });
    });

    return await batch.commit();
  }
}

export const boatService = new BoatService();
