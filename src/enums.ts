export enum STRATEGY {
  OLDEST = "Oudste",
  AVERAGE = "Gemiddelde",
}

export enum AGE_CODE {
  FOURTEEN = "14",
  SIXTEEN = "16",
  EIGHTEEN = "18",
  OPEN = "-",
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

export enum BOAT_CODE {
  C_SKIFF = "C1X",
  C_BOARD_FOUR = "C4+",
  C_SCULL_FOUR = "C4*",
  SKIFF = "1x",
  TWO = "2-",
  TWO_SCULL = "2x",
  FOUR_BOARD_WITH = "4+",
  FOUR_BOARD_WITHOUT = "4-",
  FOUR_SCULL_WITH = "4*",
  FOUR_SCULL_WITHOUT = "4x-",
  EIGHT_BOARD_WITH = "8+",
  EIGHT_SCULL_WITH = "8*",
  C_SCULL_TWO_WITH = "C2*",
}

export const AGE_CODE_WITH_AGE = {
  [AGE_CODE.FOURTEEN]: { min: 0, max: 14 },
  [AGE_CODE.SIXTEEN]: { min: 15, max: 16 },
  [AGE_CODE.EIGHTEEN]: { min: 17, max: 18 },
  [AGE_CODE.OPEN]: { min: 0, max: 26 },
  [AGE_CODE.VA]: { min: 27, max: 35 },
  [AGE_CODE.VB]: { min: 36, max: 42 },
  [AGE_CODE.VC]: { min: 43, max: 49 },
  [AGE_CODE.VD]: { min: 50, max: 54 },
  [AGE_CODE.VE]: { min: 55, max: 59 },
  [AGE_CODE.VF]: { min: 60, max: 64 },
  [AGE_CODE.VG]: { min: 65, max: 69 },
  [AGE_CODE.VH]: { min: 70, max: 74 },
  [AGE_CODE.VI]: { min: 75, max: 79 },
  [AGE_CODE.VJ]: { min: 80, max: 84 },
  [AGE_CODE.VK]: { min: 85, max: 1230 },
};
