import { Participant } from "./participant";
import { Boat } from "./boat";
import { AgeItem, BoatType } from "./settings";
import { calculateAgeType } from "../components/utils/ageUtils";
import participantService from "../services/participantService.server";
import { UpdateTeamArgs } from "../hooks/teams/useUpdateTeam";
import { TeamAddFormParticipant } from "../components/organisms/team/team-add-button/teamAddButton";
import boatService from "../services/boatService.server";
import teamService from "../services/teamService.server";

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
}

interface UpdateTeamParticipants {
  participants: Map<string, Participant>;
  args: UpdateTeamArgs;
}

export class Team {
  private name = "";
  private id = 0;
  private club = "";
  private participants: Participant[] = [];
  private boat: null | Boat = null;
  private registrationFee = 0;
  private preferredBlock = 0;
  private coach = "";
  private phoneNumber = "";
  private remarks = "";
  private boatType: null | BoatType = null;
  private gender: null | Gender = null;
  private helm: null | Participant = null;

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
  }: TeamCreation) {
    this.name = name;
    this.id = parseInt(id);
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
  }

  getId() {
    return this.id;
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
    };
  }

  async updateTeam(args: UpdateTeamArgs) {
    const participants = await participantService.getParticipants();
    for (const key of Object.keys(args)) {
      switch (key) {
        case "helm":
          await this.updateHelm({ participants, args });
          break;
        case "club":
          this.club = args.club ?? this.club;
          break;
        case "name":
          this.name = args.name ?? this.name;
          break;
        case "preferredBlock":
          this.preferredBlock = args.preferredBlock ?? this.preferredBlock;
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
          this.boat = await this.updateBoat(args.boat ?? "");
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
      participant = await participantService.createParticipant(p);
    } else {
      participant = await participantService.updateParticipant(participant, p);
    }

    return participant;
  }

  private async updateBoat(name: string) {
    return await boatService.updateBoat(
      { name, club: this.club },
      this.boat?.getId()
    );
  }
}
