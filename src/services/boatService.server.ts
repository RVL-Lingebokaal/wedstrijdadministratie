import { Boat } from "../models/boat";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";

export class BoatService {
  private boats: Map<string, Boat> = new Map();

  async saveBoats(boats: Boat[]) {
    const batch = writeBatch(firestore);

    boats.forEach((boat) => {
      const docRef = doc(firestore, "boot", boat.getId());
      batch.set(docRef, boat.getDatabaseBoat(), { merge: true });
    });
  }

  async getBoats() {
    if (this.boats.size === 0) {
      const dbInstance = collection(firestore, "boot");
      const data = await getDocs(dbInstance);
      this.boats = data.docs.reduce(
        (acc, doc) =>
          acc.set(
            doc.id,
            new Boat({ name: doc.data().name, club: doc.data().club })
          ),
        new Map<string, Boat>()
      );
    }
    return this.boats;
  }
}

let boatService: BoatService;

if (process.env.NODE_ENV === "production") {
  boatService = new BoatService();
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.boatService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.boatService = new BoatService();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  boatService = global.boatService;
}

export default boatService;
