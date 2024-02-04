import { getDatabaseTeam, Team } from "../models/team";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import firestore from "../firebase/firebase";
import boatService from "./boatService.server";
import participantService from "./participantService.server";
import { Boat } from "../models/boat";
import { Participant } from "../models/participant";

export class TeamService {
  private teams: Map<string, Team> = new Map();

  async saveTeams(teams: Team[]) {
    const batch = writeBatch(firestore);

    teams.forEach((team) => {
      const docRef = doc(firestore, "ploeg", team.id);
      this.teams.set(team.id, team);
      batch.set(docRef, getDatabaseTeam(team), { merge: true });
    });

    return await batch.commit();
  }

  async saveTeam(team: Team) {
    const db = doc(firestore, "ploeg", team.id);

    const participants = team.helm
      ? [...team.participants, team.helm]
      : team.participants;
    const boat = team.boat;

    await participantService.saveParticipants(participants);
    if (boat) {
      await boatService.saveBoats([boat]);
    }

    if (team.id === "") {
      const docRef = await addDoc(
        collection(firestore, "ploeg"),
        getDatabaseTeam(team)
      );
      team.id = docRef.id;
    } else {
      await setDoc(db, getDatabaseTeam(team));
    }

    this.teams.set(team.id, team);
  }

  async removeAllTeams() {
    if (this.teams.size === 0) {
      return;
    }
    const dbInstance = collection(firestore, "ploeg");
    const data = await getDocs(dbInstance);

    const batch = writeBatch(firestore);
    data.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    this.teams = new Map();
  }

  async getTeams() {
    if (this.teams.size === 0) {
      const dbInstance = collection(firestore, "ploeg");
      const data = await getDocs(dbInstance);

      const boats = await boatService.getBoats();
      const participants = await participantService.getParticipants();

      this.teams = data.docs.reduce((acc, doc) => {
        const docData = doc.data();
        const team = {
          boat: boats.get(docData.boat) as Boat,
          boatType: docData.boatType,
          coach: docData.coach,
          gender: docData.gender,
          id: docData.id,
          participants: docData.participants.map(
            (id: string) => participants.get(id) as Participant
          ),
          phoneNumber: docData.phoneNumber,
          preferredBlock: parseInt(docData.preferredBlock),
          registrationFee: docData.registrationFee,
          remarks: docData.remarks,
          name: docData.name,
          club: docData.club,
          helm: docData.helm
            ? (participants.get(docData.helm) as Participant)
            : null,
          place: parseInt(docData.place),
        };
        return acc.set(team.id, team);
      }, new Map());
    }
    return this.teams;
  }

  async getTeam(teamId: string) {
    const teams = await this.getTeams();
    return teams.get(teamId);
  }
}

let teamService: TeamService;

if (process.env.NODE_ENV === "production") {
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

export default teamService;
