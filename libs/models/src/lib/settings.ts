import { Gender } from './team';

export enum AgeType {
  fourteen = '14',
  sixteen = '16',
  eighteen = '18',
  open = '-',
  VA = 'VA',
  VB = 'VB',
  VC = 'VC',
  VD = 'VD',
  VE = 'VE',
  VF = 'VF',
  VG = 'VG',
  VH = 'VH',
  VI = 'VI',
  VJ = 'VJ',
  VK = 'VK',
}

export enum AgeStrategy {
  oldest = 'oudste',
  average = 'gemiddeld',
  youngest = 'jongste',
}

export enum BoatType {
  boardEightWith = '8+',
  scullEightWith = '8*',
  scullFourWith = '4*',
  boardFourWith = '4+',
  boardFourWithout = '4-',
  scullFourWithout = '4x-',
  boardTwoWithout = '2-',
  scullTwoWithout = '2x',
  skiff = '1x',
  scullFourWithC = 'C4*',
  boardFourWithC = 'C4+',
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
  '14': '0 t/m 14',
  '16': '15 t/m 16',
  '18': '17 t/m 18',
  '-': '0 t/m 26',
  VA: '27 t/m 35',
  VB: '36 t/m 42',
  VC: '43 t/m 49',
  VD: '50 t/m 54',
  VE: '55 t/m 59',
  VF: '60 t/m 64',
  VG: '65 t/m 69',
  VH: '70 t/m 74',
  VI: '75 t/m 79',
  VJ: '80 t/m 84',
  VK: '85 t/m 120',
};

export interface Settings {
  boats: BoatItem[];
  ages: AgeItem[];
  classes: ClassItem[];
  general: {
    date: string;
    missingNumbers: number[];
  };
}

export interface SettingData {
  date: string;
  missingNumbers: number[];
}

interface TranslateClassProps {
  gender: Gender;
  boatType: BoatType;
  className: string;
}

export function translateClass({
  gender,
  boatType,
  className,
}: TranslateClassProps) {
  const translatedGender =
    gender === Gender.F
      ? 'D'
      : gender === Gender.M
      ? 'H'
      : gender === Gender.O
      ? 'Open'
      : 'Mix';
  return `${translatedGender}${boatType}${className}`;
}
