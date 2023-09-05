import { doc, getDoc, setDoc } from "firebase/firestore";
import firestore from "../firebase/firebase";
import { AgeItem, BoatItem, Settings } from "../models/settings";

export type ItemsToSave = AgeItem[] | BoatItem[];
export type SettingsType = keyof Settings;

export class SettingsService {
  private settings: Settings = { boats: [], ages: [] };

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
}

export const settingsService = new SettingsService();
