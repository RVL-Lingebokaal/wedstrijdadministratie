import { doc, getDoc, setDoc } from "firebase/firestore";
import firestore from "../firebase/firebase";
import { AgeItem, BoatItem, ClassItem, Settings } from "../models/settings";
import { Gender } from "../models/team";

export type ItemsToSave = AgeItem[] | BoatItem[] | ClassItem[];
export type SettingsType = keyof Settings;

export class SettingsService {
  private settings: Settings = { boats: [], ages: [], classes: [] };

  async getSettings() {
    if (
      this.settings?.ages?.length === 0 ||
      this.settings?.boats?.length === 0 ||
      !this.settings
    ) {
      const docRef = doc(firestore, "settings", "items");
      const data = await getDoc(docRef);
      if (data.exists()) {
        this.settings = data.data() as Settings;
      }
    }
    return this.settings;
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
    const newItems = this.settings.classes.splice(index, 1);
    await this.saveSettings("classes", newItems);
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
