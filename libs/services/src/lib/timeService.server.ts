import {
  getSpecificTimeResultFromTeam,
  getTimeResult,
  SaveStartNumberTime,
  Time,
} from '@models';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import firestore from './firebase/firebase';
import { DateTime } from 'luxon';
import { teamService } from '@services';

export class TimeService {
  watchTimeUpdates(
    isA: boolean,
    isStart: boolean,
    updateFunction: (data: Time[]) => void
  ) {
    const dbInstance = collection(firestore, 'time');
    const toDay = DateTime.now().set({
      hour: 1,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const q = query(
      dbInstance,
      where('isA', '==', isA),
      where('isStart', '==', isStart),
      where('time', '>=', toDay.toMillis()),
      orderBy('time', 'desc')
    );

    return onSnapshot(q, (doc) => {
      updateFunction(
        doc.docChanges().reduce((result, d) => {
          if (d.type !== 'removed') {
            result.push({ time: d.doc.data()['time'], id: d.doc.id });
          }
          return result;
        }, [] as Time[])
      );
    });
  }

  async saveTime(time: SaveStartNumberTime) {
    const team = await teamService.getTeam(time.teamId);
    const docRef = doc(firestore, 'ploeg', time.teamId);
    const timeObject = {
      ...team?.result,
      ...getTimeResult(time.isA, time.isStart, time.time),
    };
    await setDoc(docRef, { result: timeObject }, { merge: true });

    return await deleteDoc(doc(firestore, 'time', time.id));
  }

  async deleteTime(time: Time) {
    return await deleteDoc(doc(firestore, 'time', time.id));
  }

  async restoreTime(teamId: string, isA: boolean, isStart: boolean) {
    const team = await teamService.getTeam(teamId);

    if (!team) {
      return;
    }

    const time = getSpecificTimeResultFromTeam(isA, isStart, team);

    if (!time) {
      return;
    }

    await teamService.removeTimeFromTeam(teamId, isA, isStart);
    return await setDoc(doc(firestore, 'time'), {
      time,
      isA: isA,
      isStart: isStart,
    });
  }

  async addTime(time: string, isA: boolean, isStart: boolean) {
    return await addDoc(collection(firestore, 'time'), { time, isA, isStart });
  }
}

let timeService: TimeService;

if (process.env['NODE_ENV'] === 'production') {
  timeService = new TimeService();
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.timeService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.timeService = new TimeService();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  timeService = global.timeService;
}

export { timeService };
