import { Participant, ParticipantCreation } from "../models/participant";
import {
  addDoc,
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

  async saveParticipants(participants: Participant[]) {
    const batch = writeBatch(firestore);

    participants.forEach((participant) => {
      const docRef = doc(firestore, "deelnemer", participant.getId());
      this.participants.set(participant.getId(), participant);
      batch.set(docRef, participant.getDatabaseParticipant(), { merge: true });
    });

    return await batch.commit();
  }

  async removeAllParticipants() {
    if (this.participants.size === 0) {
      return;
    }

    const dbInstance = collection(firestore, "deelnemer");
    const data = await getDocs(dbInstance);

    let batch = writeBatch(firestore);
    const batchSize = 500;

    for (let i = 0; i < data.size; i++) {
      batch.delete(data.docs[i].ref);
      if (i % batchSize === 0) {
        await batch.commit();
        batch = writeBatch(firestore);
      }
    }

    await batch.commit();

    this.participants = new Map();
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
            blocks: new Set(JSON.parse(docData.preferredBlocks)[0]),
            preferredBlock: JSON.parse(docData.preferredBlocks)[0][0],
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
    preferredBlock,
  }: Omit<ParticipantCreation, "id"> & { preferredBlock: number }) {
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

    const participant = new Participant({
      name,
      id: "",
      club,
      birthYear,
      preferredBlock,
    });

    const docRef = await addDoc(
      collection(firestore, "deelnemer"),
      participant.getDatabaseParticipant()
    );
    participant.setId(docRef.id);

    this.participants = this.participants.set(participant.getId(), participant);

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
