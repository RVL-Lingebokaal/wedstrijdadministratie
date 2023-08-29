import { doc, getDoc, setDoc } from "firebase/firestore";
import firestore from "../firebase/firebase";
import { AgeItem, BoatItem, Settings } from "../models/settings";

export type ItemsToSave = AgeItem[] | BoatItem[];
export type SettingsType = "boats" | "ages";

export class SettingsService {
  async getSettings(): Promise<Settings | undefined> {
    const docRef = doc(firestore, "settings", "items");
    const data = await getDoc(docRef);
    if (data.exists()) {
      return data.data() as Settings;
    }
    return undefined;
  }

  async saveSettings(type: SettingsType, items: ItemsToSave) {
    const docRef = doc(firestore, "settings", "items");
    return setDoc(docRef, { [type]: items }, { merge: true });
  }
}

export const settingsService = new SettingsService();
