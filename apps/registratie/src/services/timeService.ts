import firestore from '@react-native-firebase/firestore';

export class TimeService {
  async saveTime(time: number, isA: boolean, isStart: boolean) {
    return await firestore().collection('time').add({ time, isA, isStart });
  }
}

export const timeService = new TimeService();
