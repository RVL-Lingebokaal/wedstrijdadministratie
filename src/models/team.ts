import { Participant } from "./participant";
import { Boat } from "./boat";
import { AgeItem, BoatType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";
import participantService from "../services/participantService.server";
import { UpdateTeamArgs } from "../hooks/teams/useUpdateTeam";
import { TeamAddFormParticipant } from "../components/organisms/team/team-add-button/teamAddButton";
import boatService from "../services/boatService.server";
import teamService from "../services/teamService.server";
import { BlockError } from "./error";

export enum Gender {
  M = "male",
  F = "female",
  MIX = "mix",
}

interface TeamCreation {
  name: string;
  id: string;
  club: string;
  participants: Participant[];
  boat: Boat;
  registrationFee: number;
  preferredBlock: number;
  coach: string;
  phoneNumber: string;
  remarks: string;
  boatType: BoatType;
  gender: Gender;
  helm: Participant | null;
  place?: number;
}

interface UpdateTeamParticipants {
  participants: Map<string, Participant>;
  args: UpdateTeamArgs;
}

export class Team {
  private name = "";
  private id = "";
  private club = "";
  private participants: Participant[] = [];
  private boat: null | Boat = null;
  private registrationFee = 0;
  private preferredBlock = 1;
  private coach = "";
  private phoneNumber = "";
  private remarks = "";
  private boatType: null | BoatType = null;
  private gender: null | Gender = null;
  private helm: null | Participant = null;
  private block: null | number = null;
  private place = 0;

  constructor({
    name,
    id,
    club,
    participants,
    boat,
    registrationFee,
    coach,
    phoneNumber,
    preferredBlock,
    remarks,
    boatType,
    gender,
    helm,
    place,
  }: TeamCreation) {
    this.name = name;
    this.id = id;
    this.club = club;
    this.participants = participants;
    this.boat = boat;
    this.registrationFee = registrationFee;
    this.coach = coach;
    this.phoneNumber = phoneNumber;
    this.remarks = remarks;
    this.preferredBlock = preferredBlock;
    this.boatType = boatType;
    this.gender = gender;
    this.helm = helm ?? null;
    this.place = place ?? this.place;
  }

  getId() {
    return this.id;
  }

  setId(id: string) {
    this.id = id;
  }

  getNameAndId() {
    return `${this.id} - ${this.name}`;
  }

  getName() {
    return this.name;
  }

  getGender() {
    return this.gender;
  }

  getBoatType() {
    return this.boatType;
  }

  getClub() {
    return this.club;
  }

  getParticipants() {
    return this.participants;
  }

  getBoat() {
    return this.boat;
  }

  getHelm() {
    return this.helm;
  }

  getAgeClass(ages: AgeItem[]) {
    if (this.participants.length === 1) {
      return this.participants[0].getAgeType(ages);
    }
    const total = this.participants.reduce(
      (acc, participant) => acc + participant.getAge(),
      0
    );
    const age = total / this.participants.length;
    return calculateAgeType(ages, age);
  }

  getPreferredBlock() {
    return this.preferredBlock;
  }

  getBlock() {
    return this.block ?? this.preferredBlock;
  }

  getRemarks() {
    return this.remarks;
  }

  getPlace() {
    return this.place;
  }

  getDatabaseTeam() {
    return {
      id: this.id,
      name: this.name,
      club: this.club,
      participants: this.participants.map((participant) => participant.getId()),
      boat: this.boat?.getId() ?? "",
      registrationFee: this.registrationFee,
      coach: this.coach,
      phoneNumber: this.phoneNumber,
      remarks: this.remarks,
      preferredBlock: this.preferredBlock,
      boatType: this.boatType,
      gender: this.gender,
      helm: this.helm?.getId() ?? null,
      place: this.place,
    };
  }

  setPlace(place: number) {
    this.place = place;
  }

  setPreferredBlock(block: number) {
    //First try the participants
    let participantIndex = undefined;
    try {
      this.participants.forEach((p, index) => {
        p.updateBlock(this.preferredBlock, block);
        participantIndex = index;
      });
    } catch (e) {
      if (participantIndex) {
        for (let i = 0; i <= participantIndex; i++) {
          this.participants[i].updateBlock(block, this.preferredBlock, true);
        }
      }
      throw new BlockError({
        name: "PARTICIPANT_BLOCK",
        message: "Participant is already in this block",
      });
    }

    //Then, try to update the helm in case the helm exists
    if (this.helm) {
      try {
        this.helm.updateBlock(this.preferredBlock, block);
      } catch (e) {
        this.participants.forEach((p) =>
          p.updateBlock(block, this.preferredBlock, true)
        );

        throw new BlockError({
          name: "HELM_BLOCK",
          message: "Helm is already in this block",
        });
      }
    }

    //Finally, try to update the boat
    try {
      this.boat?.updateBlock(this.preferredBlock, block);
    } catch (e) {
      this.participants.forEach((p) =>
        p.updateBlock(block, this.preferredBlock, true)
      );
      this.helm?.updateBlock(block, this.preferredBlock, true);

      throw new BlockError({
        name: "BOAT_BLOCK",
        message: "Boat is already in this block",
      });
    }

    this.preferredBlock = block;
  }

  async updateTeam(args: UpdateTeamArgs) {
    const participants = await participantService.getParticipants();
    for (const key of Object.keys(args)) {
      switch (key) {
        case "preferredBlock":
          this.preferredBlock = args.preferredBlock
            ? parseInt(args.preferredBlock.toString())
            : this.preferredBlock;
          break;
        case "helm":
          await this.updateHelm({ participants, args });
          break;
        case "club":
          this.club = args.club ?? this.club;
          break;
        case "name":
          this.name = args.name ?? this.name;
          break;
        case "gender":
          this.gender = args.gender ?? this.gender;
          break;
        case "boatType":
          this.boatType = args.boatType ?? this.boatType;
          break;
        case "participants":
          this.participants =
            (await this.updateParticipants({ participants, args })) ?? [];
          break;
        case "boat":
          this.boat = await this.updateBoat(
            args.boat ?? "",
            args.preferredBlock
          );
          break;
      }
    }
    await teamService.saveTeam(this);
  }

  private async updateHelm({ participants, args }: UpdateTeamParticipants) {
    if (!args.helm) {
      return;
    }

    const participant = await this.createParticipant(
      participants,
      args.helm,
      args.helm.id
    );

    this.helm = participant ?? null;
  }

  private async updateParticipants({
    participants,
    args,
  }: UpdateTeamParticipants) {
    if (!args.participants) {
      return;
    }
    const newParticipants: Participant[] = [];
    for (const p of args.participants) {
      const participant = await this.createParticipant(participants, p, p.id);
      newParticipants.push(participant);
    }
    return newParticipants;
  }

  private async createParticipant(
    participants: Map<string, Participant>,
    p: TeamAddFormParticipant,
    id?: string
  ) {
    let participant = id ? participants.get(id) : undefined;
    if (!participant) {
      participant = await participantService.createParticipant({
        ...p,
        blocks: new Set([this.preferredBlock]),
      });
    } else {
      participant = await participantService.updateParticipant(participant, p);
    }

    return participant;
  }

  private async updateBoat(name: string, block?: number) {
    const preferredBlock = block ?? this.preferredBlock;
    return await boatService.updateBoat(
      { name, club: this.club, blocks: [preferredBlock] },
      this.boat?.getId()
    );
  }
}
