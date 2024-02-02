import { Boat, getBoatId } from "../models/boat";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import firestore from "../firebase/firebase";
import { stringifySet } from "../utils/blocks";

export class BoatService {
  private boats: Map<string, Boat> = new Map();

  async saveBoats(boats: Boat[]) {
    const batch = writeBatch(firestore);

    boats.forEach((boat) => {
      const { name, club, blocks, id } = boat;
      const docRef = doc(firestore, "boot", id);
      this.boats.set(id, boat);
      batch.set(
        docRef,
        { name, club, blocks: stringifySet(blocks) },
        { merge: true }
      );
    });

    return await batch.commit();
  }

  async removeAllBoats() {
    if (this.boats.size === 0) {
      return;
    }
    const dbInstance = collection(firestore, "boot");
    const data = await getDocs(dbInstance);

    const batch = writeBatch(firestore);
    data.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    this.boats = new Map();
  }

  async getBoats() {
    if (this.boats.size === 0) {
      const dbInstance = collection(firestore, "boot");
      const data = await getDocs(dbInstance);
      this.boats = data.docs.reduce(
        (acc, doc) =>
          acc.set(doc.id, {
            id: doc.id,
            name: doc.data().name,
            club: doc.data().club,
            blocks: JSON.parse(doc.data().blocks),
          }),
        new Map<string, Boat>()
      );
    }
    return this.boats;
  }

  async updateBoat(args: Omit<Boat, "id">, id?: string) {
    let boat = id ? this.boats.get(id) : undefined;
    if (!boat) {
      boat = {
        ...args,
        id: getBoatId(args.name, args.club),
      };
    }

    this.boats.set(boat.id, boat);

    const docRef = doc(firestore, "boot", boat.id);
    await setDoc(
      docRef,
      { ...args, blocks: stringifySet(args.blocks) },
      { merge: true }
    );

    return boat;
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
