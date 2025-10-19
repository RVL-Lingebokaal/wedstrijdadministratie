import { Boat, getBoatId } from '@models';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firestore from './firebase/firebase';
import { stringifySet } from '@utils';
import { Collections } from '../types/databaseCollections';

export class BoatService {
  private boats: Map<string, Boat> = new Map();

  async saveBoats(boats: Boat[]) {
    const batch = writeBatch(firestore);

    boats.forEach((boat) => {
      const { name, club, blocks, id, wedstrijdId } = boat;
      const docRef = doc(firestore, 'boot', id);
      this.boats.set(id, boat);
      batch.set(
        docRef,
        { name, club, blocks: stringifySet(blocks), wedstrijdId },
        { merge: true }
      );
    });

    return await batch.commit();
  }

  async removeAllBoats(wedstrijdId: string) {
    if (this.boats.size === 0) {
      return;
    }
    const dbInstance = collection(firestore, Collections.BOOT);
    const q = query(dbInstance, where('wedstrijdId', '==', wedstrijdId));
    const data = await getDocs(q);

    const batch = writeBatch(firestore);
    data.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    const otherBoats = Array.from(this.boats.values()).filter(
      (boat) => boat.wedstrijdId !== wedstrijdId
    );

    if (otherBoats.length === 0) {
      this.boats = new Map();
      return;
    }

    this.boats = otherBoats.reduce(
      (acc, boat) => acc.set(boat.id, boat),
      new Map<string, Boat>()
    );
  }

  async getBoats(wedstrijdId: string) {
    if (this.boats.size === 0) {
      const dbInstance = collection(firestore, Collections.BOOT);
      const q = query(dbInstance);
      const data = await getDocs(q);

      this.boats = data.docs.reduce(
        (acc, doc) =>
          acc.set(doc.id, {
            id: doc.id,
            name: doc.data()['name'],
            club: doc.data()['club'],
            blocks: JSON.parse(doc.data()['blocks']),
            wedstrijdId: doc.data()['wedstrijdId'],
          }),
        new Map<string, Boat>()
      );
    }

    const boats = Array.from(this.boats.values()).filter(
      (boat) => boat.wedstrijdId === wedstrijdId
    );

    return boats.reduce(
      (acc, boat) => acc.set(boat.id, boat),
      new Map<string, Boat>()
    );
  }

  async updateBoat(args: Omit<Boat, 'id'>, id?: string) {
    let boat = id ? this.boats.get(id) : undefined;
    if (!boat) {
      boat = {
        ...args,
        id: getBoatId(args.name, args.club),
      };
    }

    this.boats.set(boat.id, boat);

    const docRef = doc(firestore, 'boot', boat.id);
    await setDoc(
      docRef,
      { ...args, blocks: stringifySet(args.blocks) },
      { merge: true }
    );

    return boat;
  }
}

let boatService: BoatService;

if (process.env['NODE_ENV'] === 'production') {
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

export { boatService };
