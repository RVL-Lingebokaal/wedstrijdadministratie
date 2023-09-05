import { Team } from "../models/team";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";
import { boatService } from "./boatService.server";
import { participantService } from "./participantService.server";
import { Boat } from "../models/boat";
import { Participant } from "../models/participant";

export class TeamService {
  private teams: Team[] = [];

  async saveTeams(teams: Team[]) {
    const batch = writeBatch(firestore);

    teams.forEach((team) => {
      const docRef = doc(firestore, "ploeg", team.getId());
      batch.set(docRef, team.getDatabaseTeam(), { merge: true });
    });

    return await batch.commit();
  }

  async getTeams() {
    if (this.teams.length === 0) {
      const dbInstance = collection(firestore, "ploeg");
      const data = await getDocs(dbInstance);

      const boats = await boatService.getBoats();
      const participants = await participantService.getParticipants();

      this.teams = data.docs.map((doc) => {
        const docData = doc.data();
        return new Team({
          boat: boats.get(docData.boat) as Boat,
          boatType: docData.boatType,
          coach: docData.coach,
          gender: docData.gender,
          id: docData.id,
          participants: docData.participants.map(
            (id: string) => participants.get(id) as Participant
          ),
          phoneNumber: docData.phoneNumber,
          preferredBlock: docData.preferredBlock,
          registrationFee: docData.registrationFee,
          remarks: docData.remarks,
          name: docData.name,
          club: docData.club,
          helm: docData.helm
            ? (participants.get(docData.helm) as Participant)
            : null,
        });
      });
    }
    return this.teams;
  }
}

export const teamService = new TeamService();
