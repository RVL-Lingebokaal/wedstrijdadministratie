import firestore from '@react-native-firebase/firestore';
import { Collections } from './collections';

export class WedstrijdService {
  async getWedstrijden() {
    const docs = await firestore().collection(Collections.WEDSTRIJD).get();

    return docs.docs.map((doc) => ({
      id: doc.id,
      name: doc.get('name')?.toString() ?? '',
    }));
  }
}

export const wedstrijdService = new WedstrijdService();
