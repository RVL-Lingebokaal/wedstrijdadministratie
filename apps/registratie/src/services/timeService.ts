import firestore from '@react-native-firebase/firestore';

export class TimeService {
  currentTime: number = new Date().getTime();

  async saveTime(time: number, isA: boolean, isStart: boolean) {
    const oldTime = this.currentTime;
    const difference = time - oldTime;

    if (time < this.currentTime + 500) return;

    this.currentTime = time;

    return await firestore()
      .collection('time')
      .add({ time, isA, isStart, oldTime, difference });
  }
}

export const timeService = new TimeService();
