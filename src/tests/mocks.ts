import {
  BOAT_NAME,
  HELM,
  TEAM_CLUB,
  TEAM_COMPETITION_CODE,
  TEAM_PREFFERED_BLOCK,
} from "../services/constants";
import { Boat } from "../models/boat";
import { Participant } from "../models/participant";
import { AgeStrategy, AgeType, BoatType, Settings } from "../models/settings";
import { Gender, Team } from "../models/team";

export const BASIC_CSV_RECORD = {
  [BOAT_NAME]: "bootnaam",
  [TEAM_CLUB]: "teamclub",
  [TEAM_COMPETITION_CODE]: "h8",
  [TEAM_PREFFERED_BLOCK]: 1,
};

export const CSV_RECORD = {
  Slag: "slag",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  Boeg: "boeg",
  "NKODE Slag": "nkode Slag",
  "geb Slag": "1900",
  "VKODE Slag": "vkode Slag",
  "NKODE 2": "nkode 2",
  "geb 2": "1900",
  "VKODE 2": "vkode 2",
  "NKODE 3": "nkode 3",
  "geb 3": "1900",
  "VKODE 3": "vkode 3",
  "NKODE 4": "nkode 4",
  "geb 4": "1900",
  "VKODE 4": "vkode 4",
  "NKODE 5": "nkode 5",
  "geb 5": "1900",
  "VKODE 5": "vkode 5",
  "NKODE 6": "nkode 6",
  "geb 6": "1900",
  "VKODE 6": "vkode 6",
  "NKODE 7": "nkode 7",
  "geb 7": "1900",
  "VKODE 7": "vkode 7",
  "NKODE Boeg": "nkode Boeg",
  "geb Boeg": "1900",
  "VKODE Boeg": "vkode Boeg",
  [HELM]: HELM,
  [`NKODE ${HELM}`]: `nkode ${HELM}`,
  [`VKODE ${HELM}`]: `vkode ${HELM}`,
  [`geb ${HELM}`]: "1900",
  ...BASIC_CSV_RECORD,
};

export const mockBoat: Boat = {
  name: "name",
  club: "club",
  id: "1",
  blocks: new Set([1]),
};

export const mockParticipant: Participant = {
  birthYear: 1999,
  blocks: new Set([1]),
  club: "club",
  id: "id",
  name: "name",
};

export const mockSettings: Settings = {
  boats: [{ type: BoatType.skiff, correction: 1, price: 10 }],
  ages: [
    {
      type: AgeType.eighteen,
      age: "16-18",
      correctionFemale: 1,
      correctionMale: 1,
      strategy: AgeStrategy.average,
    },
  ],
  classes: [
    { name: "name", gender: Gender.M, boatType: BoatType.skiff, ages: [] },
  ],
  general: { date: "1900-01-01" },
};

export const mockTeam: Team = {
  name: "name",
  id: "id",
  club: "club",
  participants: [],
  registrationFee: 20,
  preferredBlock: 1,
  phoneNumber: "123456789",
  remarks: "",
  boatType: BoatType.skiff,
  gender: Gender.M,
  place: 1,
  helm: null,
};
