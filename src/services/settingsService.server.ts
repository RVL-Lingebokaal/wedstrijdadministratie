import { doc, getDoc, setDoc } from "firebase/firestore";
import firestore from "../firebase/firebase";
import { AgeItem, BoatItem, ClassItem, Settings } from "../models/settings";

export type ItemsToSave = AgeItem[] | BoatItem[] | ClassItem[];
export type SettingsType = keyof Settings;

export class SettingsService {
  private settings: Settings = {
    boats: [],
    ages: [],
    classes: [],
    general: { date: "" },
  };

  async getSettings() {
    if (
      this.settings?.ages?.length === 0 ||
      this.settings?.boats?.length === 0 ||
      !this.settings
    ) {
      const docRef = doc(firestore, "settings", "items");
      const data = await getDoc(docRef);

      if (data.exists()) {
        const items = data.data() as Settings;
        this.settings.boats = items.boats;
        this.settings.classes = items.classes;
        this.settings.ages = items.ages;
      }
    }
    return this.settings;
  }

  async getGeneralSettings() {
    if (!this.settings.general.date) {
      const docRef = doc(firestore, "settings", "general");
      const data = await getDoc(docRef);

      if (data.exists()) {
        this.settings.general = data.data() as { date: string };
      }
    }
    return this.settings.general;
  }

  async saveSettings(type: SettingsType, items: ItemsToSave) {
    this.settings[type] = items as any;

    const docRef = doc(firestore, "settings", "items");
    return setDoc(docRef, { [type]: items }, { merge: true });
  }

  async removeClassItem({ name, boatType, gender }: ClassItem) {
    const index = this.settings.classes.findIndex(
      (c) => c.gender === gender && c.boatType === boatType && c.name === name
    );
    this.settings.classes.splice(index, 1);
    const newItems = this.settings.classes;
    await this.saveSettings("classes", newItems);
  }

  async saveGeneralSettings(settings: { date: string }) {
    this.settings.general = settings;
    const docRef = doc(firestore, "settings", "general");
    return await setDoc(docRef, settings, { merge: true });
  }
}

let settingsService: SettingsService;

if (process.env.NODE_ENV === "production") {
  settingsService = new SettingsService();
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.settingsService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.settingsService = new SettingsService();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  settingsService = global.settingsService;
}

export default settingsService;
