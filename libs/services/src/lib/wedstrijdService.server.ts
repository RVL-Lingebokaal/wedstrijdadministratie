import { addDoc, collection, doc, getDocs, setDoc } from 'firebase/firestore';
import firestore from './firebase/firebase';
import { WedstrijdAddForm } from '@schemas';
import { DateTime } from 'luxon';
import { isWedstrijd, Wedstrijd, wedstrijdSchema } from '@models';

export class WedstrijdService {
  private wedstrijden: Map<string, Wedstrijd> = new Map();

  async upsertWedstrijd(wedstrijd: WedstrijdAddForm | Wedstrijd) {
    if (!isWedstrijd(wedstrijd)) {
      const newId = `${wedstrijd.name.toLowerCase().substring(0, 5)}${
        DateTime.fromISO(wedstrijd.date).year
      }`;
      await addDoc(collection(firestore, 'wedstrijd'), {
        id: newId,
        ...wedstrijd,
      });
      const newWedstrijd = { ...wedstrijd, id: newId };
      this.wedstrijden.set(newId, newWedstrijd);
      return newWedstrijd;
    } else {
      const db = doc(firestore, 'wedstrijd', wedstrijd.id);
      await setDoc(db, { ...wedstrijd }, { merge: true });
      this.wedstrijden.set(wedstrijd.id, wedstrijd);
      return wedstrijd;
    }
  }

  async getWedstrijden() {
    if (this.wedstrijden.size === 0) {
      const dbInstance = collection(firestore, 'wedstrijd');
      const data = await getDocs(dbInstance);

      this.wedstrijden = data.docs.reduce((map, doc) => {
        const wedstrijd = wedstrijdSchema.parse({ id: doc.id, ...doc.data() });
        map.set(doc.id, wedstrijd);
        return map;
      }, new Map<string, Wedstrijd>());
    }

    return Array.from(this.wedstrijden.values());
  }

  async getWedstrijdById(id: string) {
    const wedstrijden = await this.getWedstrijden();
    const wedstrijd = wedstrijden.find((wedstrijd) => wedstrijd.id === id);

    if (!wedstrijd) {
      throw new Error('Wedstrijd not found');
    }

    return wedstrijd;
  }
}

let wedstrijdService: WedstrijdService;

if (process.env['NODE_ENV'] === 'production') {
  wedstrijdService = new WedstrijdService();
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.wedstrijdService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.wedstrijdService = new WedstrijdService();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  wedstrijdService = global.wedstrijdService;
}

export { wedstrijdService };
