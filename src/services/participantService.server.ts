import { Participant } from "../models/participant";
import { doc, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";

export class ParticipantService {
  async saveParticipants(participants: Participant[]) {
    const batch = writeBatch(firestore);

    participants.forEach((participant) => {
      const docRef = doc(firestore, "deelnemer", participant.getId());
      batch.set(docRef, participant.getDatabaseParticipant(), { merge: true });
    });

    return await batch.commit();
  }
}

export const participantService = new ParticipantService();
