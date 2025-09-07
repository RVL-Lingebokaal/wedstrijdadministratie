import { Gender } from './team';
import { z } from 'zod';

export const ageTypes = [
  '14',
  '16',
  '18',
  '-',
  'VA',
  'VB',
  'VC',
  'VD',
  'VE',
  'VF',
  'VG',
  'VH',
  'VI',
  'VJ',
  'VK',
];
export type AgeType = (typeof ageTypes)[number];

export const ageStrategies = ['oudste', 'gemiddeld', 'jongste'] as const;
export type AgeStrategy = (typeof ageStrategies)[number];

export const boatTypes = [
  '8+',
  '8*',
  '4*',
  '4+',
  '4-',
  '4x-',
  '2-',
  '2x',
  '1x',
  'C4*',
  'C4+',
  'C3x',
] as const;
export type BoatType = (typeof boatTypes)[number];

const boatItemForm = z.object({
  type: z.enum(boatTypes),
  correction: z.number(),
  price: z.number().min(0),
});
export type BoatItem = z.infer<typeof boatItemForm>;
export const boatForm = z.object({
  items: z.array(boatItemForm).min(1),
});
export type BoatForm = z.infer<typeof boatForm>;

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

export const ageTranslations: Record<string, string> = {
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
    gender === 'female'
      ? 'D'
      : gender === 'male'
      ? 'H'
      : gender === 'mix'
      ? 'Mix'
      : 'Open';
  return `${translatedGender}${boatType}${className}`;
}
