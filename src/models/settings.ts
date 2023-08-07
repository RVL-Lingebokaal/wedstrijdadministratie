export enum AgeTypes {
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

export interface SettingsItem {
  type: AgeTypes;
  age: string;
  correctionMale: number;
  correctionFemale: number;
  strategy: AgeStrategy;
}

export interface SettingsForm {
  items: SettingsItem[];
}
