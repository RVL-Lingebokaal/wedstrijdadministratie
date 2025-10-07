import firestore from '@react-native-firebase/firestore';
import { Collections } from './collections';

export class TimeService {
  currentTime: number = new Date().getTime();

  async saveTime(
    time: number,
    isA: boolean,
    isStart: boolean,
    wedstrijdId: string
  ) {
    const oldTime = this.currentTime;
    const difference = time - oldTime;

    if (time < this.currentTime + 500) return;

    this.currentTime = time;

    return await firestore()
      .collection(Collections.TIME)
      .add({ time, isA, isStart, oldTime, difference, wedstrijdId });
  }
}

export const timeService = new TimeService();
