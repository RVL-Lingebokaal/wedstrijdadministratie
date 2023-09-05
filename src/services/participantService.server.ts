import { Participant } from "../models/participant";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";

export class ParticipantService {
  private participants: Map<string, Participant> = new Map();

  async saveParticipants(participants: Participant[]) {
    const batch = writeBatch(firestore);

    participants.forEach((participant) => {
      const docRef = doc(firestore, "deelnemer", participant.getId());
      batch.set(docRef, participant.getDatabaseParticipant(), { merge: true });
    });

    this.participants = participants.reduce(
      (acc, participant) => acc.set(participant.getId(), participant),
      new Map<string, Participant>()
    );

    return await batch.commit();
  }

  async getParticipants() {
    if (this.participants.size === 0) {
      const dbInstance = collection(firestore, "deelnemer");
      const data = await getDocs(dbInstance);
      this.participants = data.docs.reduce((acc, doc) => {
        const docData = doc.data();
        return acc.set(
          doc.id,
          new Participant({
            name: docData.name,
            club: docData.club,
            birthYear: docData.birthYear,
            id: docData.id,
          })
        );
      }, new Map<string, Participant>());
    }
    return this.participants;
  }
}

export const participantService = new ParticipantService();
