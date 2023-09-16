import { Participant } from "../models/participant";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import firestore from "../firebase/firebase";

export class ParticipantService {
  private participants: Map<string, Participant> = new Map();

  async saveParticipants(participants: Participant[]) {
    const batch = writeBatch(firestore);

    participants.forEach((participant) => {
      const docRef = doc(firestore, "deelnemer", participant.getId());
      this.participants.set(participant.getId(), participant);
      batch.set(docRef, participant.getDatabaseParticipant(), { merge: true });
    });

    return await batch.commit();
  }

  async getParticipants(needsRefetch = false) {
    if (this.participants.size === 0 || needsRefetch) {
      const dbInstance = collection(firestore, "deelnemer");
      const data = await getDocs(dbInstance);
      this.participants = data.docs.reduce((acc, doc) => {
        const docData = doc.data();
        return acc.set(
          docData.id,
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
let participantService: ParticipantService;

if (process.env.NODE_ENV === "production") {
  participantService = new ParticipantService();
} else {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.participantService) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.participantService = new ParticipantService();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  participantService = global.participantService;
}

export default participantService;
