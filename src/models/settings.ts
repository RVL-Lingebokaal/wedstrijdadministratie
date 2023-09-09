import { Gender } from "./team";

export enum AgeType {
  fourteen = "14",
  sixteen = "16",
  eighteen = "18",
  open = "-",
  VA = "VA",
  VB = "VB",
  VC = "VC",
  VD = "VD",
  VE = "VE",
  VF = "VF",
  VG = "VG",
  VH = "VH",
  VI = "VI",
  VJ = "VJ",
  VK = "VK",
}

export enum AgeStrategy {
  oldest = "oudste",
  average = "gemiddeld",
  youngest = "jongste",
}

export enum BoatType {
  cBoatOne = "C1x",
  cBoatFourBoardWith = "C4+",
  cBoatFourWith = "C4*",
  cBoatTwoWith = "C2*",
  cBoatTwoScull = "C2x",
  skiff = "1x",
  boatTwoBoard = "2-",
  boatTwoScull = "2x",
  boatFourBoardWith = "4+",
  boatFourBoard = "4-",
  boatFourWith = "4*",
  boatFour = "4x-",
  boatEightBoardWith = "8+",
  boatEightWith = "8*",
}

export interface BoatItem {
  type: BoatType;
  correction: number;
  price: number;
}

export interface BoatForm {
  items: BoatItem[];
}

export interface ClassItem {
  name: string;
  boatType: BoatType;
  ages: AgeType[];
  gender: Gender;
}

export interface AgeItem {
  type: AgeType;
  age: string;
  correctionMale: number;
  correctionFemale: number;
  strategy: AgeStrategy;
}

export interface AgeForm {
  items: AgeItem[];
}

export const ageTranslations = {
  "14": "0 t/m 14",
  "16": "15 t/m 16",
  "18": "17 t/m 18",
  "-": "0 t/m 26",
  VA: "27 t/m 35",
  VB: "36 t/m 42",
  VC: "43 t/m 49",
  VD: "50 t/m 54",
  VE: "55 t/m 59",
  VF: "60 t/m 64",
  VG: "65 t/m 69",
  VH: "70 t/m 74",
  VI: "75 t/m 79",
  VJ: "80 t/m 84",
  VK: "85 t/m 120",
};

export interface Settings {
  boats: BoatItem[];
  ages: AgeItem[];
  classes: ClassItem[];
}
