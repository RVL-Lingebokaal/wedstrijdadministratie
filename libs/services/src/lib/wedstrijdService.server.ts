import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import firestore from './firebase/firebase';
import { DateTime } from 'luxon';
import {
  AgeItem,
  BoatItem,
  BoatType,
  ClassItem,
  CreateWedstrijdForm,
  SaveGeneralSettings,
  SaveSettingsSchema,
  Wedstrijd,
  wedstrijdSchema,
} from '@models';
import { settingsService } from './settingsService.server';
import { Collections } from '../types/databaseCollections';

export class WedstrijdService {
  private wedstrijden: Map<string, Wedstrijd> = new Map();

  async upsertWedstrijd(wedstrijd: CreateWedstrijdForm) {
    const { date, isJeugd, ...rest } = wedstrijd;
    const newId = `${wedstrijd.name.toLowerCase().substring(0, 5)}${
      DateTime.fromISO(date).year
    }`;
    const newWedstrijd = {
      ...rest,
      id: newId,
      settings: { general: { missingNumbers: [], isJeugd, date } },
    };
    const docRef = doc(firestore, Collections.WEDSTRIJD, newId);
    await setDoc(docRef, {
      ...rest,
      settings: { general: { missingNumbers: [], isJeugd, date } },
    });

    this.wedstrijden.set(newId, newWedstrijd);
    return newWedstrijd;
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
      general: wedstrijd.settings.general,
      boats: mergeBoatSettings(settings.boats, wedstrijd.settings.boats),
      ages: mergeAgeSettings(settings.ages, wedstrijd.settings.ages),
      classes: wedstrijd.settings.classes,
    };
  }

  async removeClassItem(id: string, { name, boatType, gender }: ClassItem) {
    const wedstrijd = await this.getWedstrijdById(id);

    if (!wedstrijd.settings.classes) return;

    const index = wedstrijd.settings.classes.findIndex(
      (c) => c.gender === gender && c.boatType === boatType && c.name === name
    );
    wedstrijd.settings.classes.splice(index, 1);
    await this.saveSettingsToWedstrijd(id, {
      type: 'classes',
      itemsToSave: wedstrijd.settings.classes,
    });
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
        date: data.date ?? wedstrijd.settings.general?.date,
        isJeugd: data.isJeugd ?? wedstrijd.settings.general?.isJeugd,
        startNumbersAreFixed:
          data.startNumbersAreFixed ??
          wedstrijd.settings.general?.startNumbersAreFixed,
      },
    };

    await setDoc(
      docRef,
      {
        settings: generalSettingsToSave,
      },
      { merge: true }
    );

    this.wedstrijden.set(wedstrijd.id, {
      ...wedstrijd,
      settings: {
        ...wedstrijd.settings,
        general: generalSettingsToSave.general,
      },
    });
  }

  async getRegistrationFee(boatType: BoatType, wedstrijdId: string) {
    const settings = await this.getSettingsFromWedstrijd(wedstrijdId);
    const boatItem = settings.boats.find((c) => c.type === boatType);

    if (!boatItem) {
      throw new Error('Boat type not found in settings');
    }

    return boatItem.price;
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

  if (!generalBoats) return wedstrijdBoats;

  return [
    ...wedstrijdBoats,
    ...generalBoats.filter(() => !wedstrijdBoats.some((wb) => wb.type)),
  ];
}

function mergeAgeSettings(generalAges: AgeItem[], wedstrijdAges?: AgeItem[]) {
  if (!wedstrijdAges) return generalAges;

  if (!generalAges) return wedstrijdAges;

  return [
    ...wedstrijdAges,
    ...generalAges.filter(() => !wedstrijdAges.some((wa) => wa.type)),
  ];
}
