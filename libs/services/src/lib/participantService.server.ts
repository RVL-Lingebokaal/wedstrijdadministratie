import { Participant } from '@models';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import firestore from './firebase/firebase';
import { stringifySet } from '@utils';
import { TeamAddFormParticipant } from '@schemas';
import { Collections } from '../types/databaseCollections';

export class ParticipantService {
  private participants: Map<string, Participant> = new Map();

  async saveParticipants(participants: Participant[]) {
    const batch = writeBatch(firestore);

    participants.forEach((participant) => {
      const { name, id, club, blocks, birthYear, wedstrijdId } = participant;
      const docRef = doc(firestore, 'deelnemer', id);
      this.participants.set(id, participant);
      batch.set(
        docRef,
        {
          name,
          club,
          birthYear,
          blocks: stringifySet(blocks),
          wedstrijdId,
        },
        { merge: true }
      );
    });

    return await batch.commit();
  }

  async removeAllParticipants(wedstrijdId: string) {
    if (this.participants.size === 0) {
      return;
    }

    const dbInstance = collection(firestore, Collections.DEELNEMER);
    const q = query(dbInstance, where('wedstrijdId', '==', wedstrijdId));
    const data = await getDocs(q);

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

  async getParticipants(wedstrijdId: string, needsRefetch = false) {
    if (this.participants.size === 0 || needsRefetch) {
      const dbInstance = collection(firestore, Collections.DEELNEMER);
      const q = query(dbInstance, where('wedstrijdId', '==', wedstrijdId));
      const data = await getDocs(q);

      this.participants = data.docs.reduce((acc, doc) => {
        const docData = doc.data();
        return acc.set(doc.id, {
          name: docData['name'],
          club: docData['club'],
          birthYear: docData['birthYear'],
          id: doc.id,
          blocks: new Set(JSON.parse(docData['blocks'])),
          wedstrijdId: docData['wedstrijdId'],
        });
      }, new Map<string, Participant>());
    }
    return this.participants;
  }

  async createParticipant({
    name,
    club,
    birthYear,
    blocks,
    wedstrijdId,
  }: Omit<Participant, 'id'>) {
    const participants = Array.from(this.participants.values());
    const foundParticipant = participants.find(
      (p) =>
        name === p.name &&
        club === p.club &&
        birthYear === p.birthYear &&
        p.wedstrijdId === wedstrijdId
    );

    if (foundParticipant) {
      return foundParticipant;
    }

    const participant = { name, id: '', club, birthYear, blocks, wedstrijdId };

    const docRef = await addDoc(collection(firestore, Collections.DEELNEMER), {
      name,
      club,
      birthYear,
      blocks: stringifySet(blocks),
      wedstrijdId,
    });
    participant.id = docRef.id;

    this.participants = this.participants.set(participant.id, participant);

    return participant;
  }

  async updateParticipant(
    participant: Participant,
    args: TeamAddFormParticipant
  ) {
    participant = { ...participant, ...args };
    this.participants = this.participants.set(participant.id, participant);

    const docRef = doc(firestore, 'deelnemer', participant.id);
    await setDoc(
      docRef,
      { ...participant, blocks: stringifySet(participant.blocks) },
      { merge: true }
    );

    return participant;
  }
}

let participantService: ParticipantService;

if (process.env['NODE_ENV'] === 'production') {
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

export { participantService };
