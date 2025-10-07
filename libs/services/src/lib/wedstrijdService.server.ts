import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import firestore from './firebase/firebase';
import { DateTime } from 'luxon';
import {
  AgeItem,
  BasicWedstrijdInfo,
  BoatItem,
  isWedstrijd,
  SaveGeneralSettings,
  SaveSettingsSchema,
  Wedstrijd,
  wedstrijdSchema,
} from '@models';
import { settingsService } from './settingsService.server';
import { Collections } from '../types/databaseCollections';

export class WedstrijdService {
  private wedstrijden: Map<string, Wedstrijd> = new Map();

  async upsertWedstrijd(wedstrijd: BasicWedstrijdInfo | Wedstrijd) {
    if (!isWedstrijd(wedstrijd)) {
      const newId = `${wedstrijd.name.toLowerCase().substring(0, 5)}${
        DateTime.fromISO(wedstrijd.date).year
      }`;
      const newWedstrijd = {
        ...wedstrijd,
        id: newId,
        settings: { general: { missingNumbers: [] } },
      };
      const docRef = doc(firestore, Collections.WEDSTRIJD, newId);
      await setDoc(docRef, {
        ...wedstrijd,
        settings: { general: { missingNumbers: [] } },
      });

      this.wedstrijden.set(newId, newWedstrijd);
      return newWedstrijd;
    } else {
      const db = doc(firestore, Collections.WEDSTRIJD, wedstrijd.id);
      await setDoc(db, { ...wedstrijd }, { merge: true });
      this.wedstrijden.set(wedstrijd.id, wedstrijd);
      return wedstrijd;
    }
  }

  async getWedstrijden() {
    if (this.wedstrijden.size === 0) {
      const dbInstance = collection(firestore, Collections.WEDSTRIJD);
      const data = await getDocs(dbInstance);

      this.wedstrijden = data.docs.reduce((map, doc) => {
        const wedstrijd = wedstrijdSchema.parse({
          id: doc.id,
          ...doc.data(),
        });

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

  async getSettingsFromWedstrijd(id: string) {
    const wedstrijd = await this.getWedstrijdById(id);
    const settings = await settingsService.getSettings();

    return {
      general: { ...wedstrijd.settings.general, date: wedstrijd.date },
      boats: mergeBoatSettings(settings.boats, wedstrijd.settings.boats),
      ages: mergeAgeSettings(settings.ages, wedstrijd.settings.ages),
      classes: wedstrijd.settings.classes,
    };
  }

  async saveSettingsToWedstrijd(id: string, data: SaveSettingsSchema) {
    const wedstrijd = await this.getWedstrijdById(id);
    const docRef = doc(firestore, Collections.WEDSTRIJD, wedstrijd.id);
    const settingsToSave = {
      ...wedstrijd.settings,
      [data.type]: data.itemsToSave,
    };

    await setDoc(docRef, { settings: settingsToSave }, { merge: true });
    this.wedstrijden.set(wedstrijd.id, {
      ...wedstrijd,
      settings: settingsToSave,
    });
  }

  async saveGeneralSettings(id: string, data: SaveGeneralSettings) {
    const wedstrijd = await this.getWedstrijdById(id);
    const docRef = doc(firestore, Collections.WEDSTRIJD, id);

    const generalSettingsToSave = {
      general: {
        missingNumbers:
          data.missingNumbers ?? wedstrijd.settings.general?.missingNumbers,
      },
    };

    await setDoc(
      docRef,
      {
        settings: generalSettingsToSave,
        date: data.date ?? wedstrijd.date,
      },
      { merge: true }
    );

    this.wedstrijden.set(wedstrijd.id, {
      ...wedstrijd,
      date: data.date ?? wedstrijd.date,
      settings: {
        ...wedstrijd.settings,
        general: generalSettingsToSave.general,
      },
    });
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

function mergeBoatSettings(
  generalBoats: BoatItem[],
  wedstrijdBoats?: BoatItem[]
) {
  if (!wedstrijdBoats) return generalBoats;

  return [
    ...wedstrijdBoats,
    ...generalBoats.filter(() => !wedstrijdBoats.some((wb) => wb.type)),
  ];
}

function mergeAgeSettings(generalAges: AgeItem[], wedstrijdAges?: AgeItem[]) {
  if (!wedstrijdAges) return generalAges;

  return [
    ...wedstrijdAges,
    ...generalAges.filter(() => !wedstrijdAges.some((wa) => wa.type)),
  ];
}
