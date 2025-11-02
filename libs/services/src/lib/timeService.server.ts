import {
  getSpecificTimeResultFromTeam,
  getTimeResult,
  PostResultsForChangeEntireBlockDto,
  PostResultsForTeamDto,
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
import { Collections, teamService } from '@services';

export class TimeService {
  watchTimeUpdates(
    isA: boolean,
    isStart: boolean,
    updateFunction: (data: Time[]) => void,
    wedstrijdId: string
  ) {
    const dbInstance = collection(firestore, Collections.TIME);
    const toDay = DateTime.now().set({
      hour: 1,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const q = query(
      dbInstance,
      where('wedstrijdId', '==', wedstrijdId),
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

  async saveTime(wedstrijdId: string, time: SaveStartNumberTime) {
    const team = await teamService.getTeam(time.teamId, wedstrijdId);

    if (!team) {
      throw new Error('Team not found');
    }

    const docRef = doc(firestore, Collections.PLOEG, time.teamId);
    const timeObject = {
      ...team.result,
      ...getTimeResult(time.isA, time.isStart, Number.parseInt(time.time)),
    };
    await setDoc(docRef, { result: timeObject }, { merge: true });
    await teamService.saveTeam({
      ...team,
      result: getTimeResult(time.isA, time.isStart, Number.parseInt(time.time)),
    });

    return await deleteDoc(doc(firestore, Collections.TIME, time.id));
  }

  async deleteTime(time: Time) {
    return await deleteDoc(doc(firestore, Collections.TIME, time.id));
  }

  async restoreTime(
    teamId: string,
    isA: boolean,
    isStart: boolean,
    wedstrijdId: string
  ) {
    const team = await teamService.getTeam(teamId, wedstrijdId);

    if (!team) {
      throw new Error('Team not found');
    }

    const time = getSpecificTimeResultFromTeam(isA, isStart, team);

    if (!time) {
      throw new Error('No time found to restore');
    }

    await teamService.removeTimeFromTeam(teamId, isA, isStart, wedstrijdId);
    return await addDoc(collection(firestore, Collections.TIME), {
      time,
      isA: isA,
      isStart: isStart,
      wedstrijdId,
    });
  }

  async addTime(
    time: string,
    isA: boolean,
    isStart: boolean,
    wedstrijdId: string
  ) {
    return await addDoc(collection(firestore, Collections.TIME), {
      time,
      isA,
      isStart,
      wedstrijdId,
    });
  }

  async addChoice(choice: PostResultsForTeamDto, wedstrijdId: string) {
    const team = await teamService.getTeam(choice.id, wedstrijdId);

    if (!team) {
      throw new Error('Team not found');
    }

    const timeObject = {
      ...team.result,
      useStartA: choice.useStartA,
      useFinishA: choice.useFinishA,
      processed: choice.processed !== undefined ? choice.processed : undefined,
    };
    await teamService.saveTeam({
      ...team,
      result: timeObject,
    });
  }

  async addChoiceEntireBlock(
    choice: PostResultsForChangeEntireBlockDto,
    wedstrijdId: string
  ) {
    const teams = await teamService.getTeams(wedstrijdId);
    const filteredTeams = teams.filter((team) => team.block === choice.block);

    const newTeams = filteredTeams.map((team) => {
      const teamUseStartA =
        team.result?.useStartA !== undefined ? team.result?.useStartA : true;
      const teamUseFinishA =
        team.result?.useFinishA !== undefined ? team.result?.useFinishA : true;
      const useStartA = choice.isStart ? choice.isA : teamUseStartA;
      const useFinishA = !choice.isStart ? choice.isA : teamUseFinishA;
      const result = {
        ...team.result,
        useStartA,
        useFinishA,
      };
      return {
        ...team,
        result,
      };
    });

    await teamService.saveTeams(newTeams);
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
