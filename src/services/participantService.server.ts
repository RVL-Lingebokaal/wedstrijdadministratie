import { Participant, ParticipantCreation } from "../models/participant";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import firestore from "../firebase/firebase";
import { TeamAddFormParticipant } from "../components/organisms/team/team-add-button/teamAddButton";

export class ParticipantService {
  private participants: Map<string, Participant> = new Map();
  private alreadyUsedIds: Set<string> = new Set<string>();

  async saveParticipants(participants: Participant[]) {
    const batch = writeBatch(firestore);

    participants.forEach((participant) => {
      const docRef = doc(firestore, "deelnemer", participant.getId());
      this.participants.set(participant.getId(), participant);
      this.alreadyUsedIds.add(participant.getId());
      batch.set(docRef, participant.getDatabaseParticipant(), { merge: true });
    });

    return await batch.commit();
  }

  async getParticipants(needsRefetch = false) {
    if (this.participants.size === 0 || needsRefetch) {
      const dbInstance = collection(firestore, "deelnemer");
      const data = await getDocs(dbInstance);

      this.alreadyUsedIds = new Set<string>();

      this.participants = data.docs.reduce((acc, doc) => {
        const docData = doc.data();
        this.alreadyUsedIds.add(docData.id);
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

  async createParticipant({
    name,
    club,
    birthYear,
  }: Omit<ParticipantCreation, "id">) {
    const participants = Array.from(this.participants.values());
    const foundParticipant = participants.find(
      (p) =>
        name === p.getName() &&
        club === p.getClub() &&
        birthYear === p.getBirthYear()
    );

    if (foundParticipant) {
      return foundParticipant;
    }

    const id = this.generateId();
    const participant = new Participant({ name, id, club, birthYear });

    this.participants = this.participants.set(id, participant);
    this.alreadyUsedIds.add(id);
    const docRef = doc(firestore, "deelnemer", participant.getId());
    await setDoc(
      docRef,
      { ...participant.getDatabaseParticipant() },
      { merge: true }
    );

    return participant;
  }

  async updateParticipant(
    participant: Participant,
    args: TeamAddFormParticipant
  ) {
    participant.updateParticipantData(args);
    this.participants = this.participants.set(participant.getId(), participant);

    const docRef = doc(firestore, "deelnemer", participant.getId());
    await setDoc(
      docRef,
      { ...participant.getDatabaseParticipant() },
      { merge: true }
    );

    return participant;
  }

  generateId() {
    let id = (Math.random() * 100000).toString();
    while (this.alreadyUsedIds.has(id)) {
      id = (Math.random() * 100000).toString();
    }
    this.alreadyUsedIds.add(id);
    return id;
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
