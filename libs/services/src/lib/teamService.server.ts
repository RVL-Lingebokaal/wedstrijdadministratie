import {
  Boat,
  getDatabaseTeam,
  getTimeResult,
  Participant,
  Team,
} from '@models';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firestore from './firebase/firebase';
import { boatService } from './boatService.server';
import { participantService } from './participantService.server';
import { Collections } from '../types/databaseCollections';

export class TeamService {
  private teams: Map<string, Team> = new Map();

  async saveTeams(teams: Team[]) {
    const batch = writeBatch(firestore);

    teams.forEach((team) => {
      const docRef = doc(firestore, Collections.PLOEG, team.id);
      this.teams.set(team.id, team);
      batch.set(docRef, getDatabaseTeam(team), { merge: true });
    });

    return await batch.commit();
  }

  async saveTeam(team: Team) {
    const participants = team.helm
      ? [...team.participants, team.helm]
      : team.participants;
    const boat = team.boat;

    await participantService.saveParticipants(participants);
    if (boat) {
      await boatService.saveBoats([boat]);
    }

    if (team.id === '') {
      const docRef = await addDoc(
        collection(firestore, Collections.PLOEG),
        getDatabaseTeam(team)
      );
      team.id = docRef.id;
    } else {
      const db = doc(firestore, Collections.PLOEG, team.id);
      await setDoc(db, getDatabaseTeam(team), { merge: true });
    }

    this.teams.set(team.id, team);
  }

  async removeAllTeams(wedstrijdId: string) {
    if (this.teams.size === 0) {
      return;
    }
    const dbInstance = collection(firestore, Collections.PLOEG);
    const q = query(dbInstance, where('wedstrijdId', '==', wedstrijdId));
    const data = await getDocs(q);

    const batch = writeBatch(firestore);
    data.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    this.teams = new Map();
  }

  async getTeams(wedstrijd: string) {
    if (this.teams.size === 0) {
      const dbInstance = collection(firestore, 'ploeg');
      const data = await getDocs(dbInstance);

      const boats = await boatService.getBoats(wedstrijd);
      const participants = await participantService.getParticipants(wedstrijd);

      this.teams = data.docs.reduce((acc, doc) => {
        const docData = doc.data();
        const team = {
          ageClass: docData['ageClass'],
          boat: boats.get(docData['boat']) as Boat,
          boatType: docData['boatType'],
          coach: docData['coach'],
          gender: docData['gender'],
          id: docData['id'],
          participants: docData['participants'].map(
            (id: string) => participants.get(id) as Participant
          ),
          phoneNumber: docData['phoneNumber'],
          preferredBlock: parseInt(docData['preferredBlock']),
          registrationFee: docData['registrationFee'],
          remarks: docData['remarks'],
          name: docData['name'],
          club: docData['club'],
          helm: docData['helm']
            ? (participants.get(docData['helm']) as Participant)
            : null,
          place: parseInt(docData['place']),
          result: docData['result'],
          startNumber: docData['startNumber'],
          block: docData['block'],
          wedstrijdId: docData['wedstrijdId'],
        };
        return acc.set(team.id, team);
      }, new Map());
    }
    const teams = [...this.teams.values()];
    return teams.filter(({ wedstrijdId }) => wedstrijdId === wedstrijd);
  }

  async getTeam(teamId: string, wedstrijd: string) {
    const teams = await this.getTeams(wedstrijd);

    if (this.teams.size > 0) return this.teams.get(teamId);

    return teams.find(
      (team) => team.id === teamId && team.wedstrijdId === wedstrijd
    );
  }

  async getResults(wedstrijd: string) {
    const dbInstance = collection(firestore, Collections.PLOEG);
    const q = query(
      dbInstance,
      where('result', '!=', null),
      where('wedstrijdId', '==', wedstrijd),
      orderBy('result')
    );
    const data = await getDocs(q);

    if (data.empty) {
      return [];
    }

    await this.getTeams(wedstrijd);

    return data.docs.map((doc) => {
      const docData = doc.data();
      const team = this.teams.get(docData['id']);

      if (!team) {
        throw new Error('Missing team for this id');
      }

      return {
        id: docData['id'],
        name: docData['name'],
        result: docData['result'],
        participants: team.participants ?? [],
        boatType: team.boatType,
        gender: team.gender,
        ageClass: docData['ageClass'],
        startNr: team.startNumber ?? 0,
        slag: team.participants[0],
        block: team.block ?? 0,
      };
    });
  }

  async removeTimeFromTeam(
    teamId: string,
    isA: boolean,
    isStart: boolean,
    wedstrijd: string
  ) {
    const team = await this.getTeam(teamId, wedstrijd);

    if (!team || !team.result) {
      return;
    }

    const newResult = { ...team.result, ...getTimeResult(isA, isStart) };
    const docRef = doc(firestore, 'ploeg', teamId);

    return updateDoc(docRef, { result: newResult });
  }
}

let teamService: TeamService;

if (process.env['NODE_ENV'] === 'production') {
  teamService = new TeamService();
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.teamService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.teamService = new TeamService();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  teamService = global.teamService;
}

export { teamService };
