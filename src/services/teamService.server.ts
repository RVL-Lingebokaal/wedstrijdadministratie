import { Team } from "../models/team";
import { doc, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";

export class TeamService {
  async saveTeams(teams: Team[]) {
    const batch = writeBatch(firestore);

    teams.forEach((team) => {
      const docRef = doc(firestore, "ploeg", team.getId());
      batch.set(docRef, team.getDatabaseTeam(), { merge: true });
    });

    return await batch.commit();
  }
}

export const teamService = new TeamService();
