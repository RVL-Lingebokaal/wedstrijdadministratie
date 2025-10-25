import { Gender, genders, translateGenderToShort } from './team';
import { z } from 'zod';

export const ageTypes = [
  '12',
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

export const boatItemForm = z.object({
  type: z.enum(boatTypes),
  correction: z.number(),
  price: z.number().min(0),
});
export type BoatItem = z.infer<typeof boatItemForm>;
export const boatForm = z.object({
  items: z.array(boatItemForm).min(1),
});
export type BoatForm = z.infer<typeof boatForm>;

export const classItem = z.object({
  name: z.string(),
  boatType: z.enum(boatTypes),
  ages: z.array(z.enum(ageTypes)).min(1),
  gender: z.enum(genders),
});
export type ClassItem = z.infer<typeof classItem>;

export const ageItem = z.object({
  type: z.enum(ageTypes),
  age: z.string(),
  correctionMale: z.number(),
  correctionFemale: z.number(),
  strategy: z.enum(ageStrategies),
});
export type AgeItem = z.infer<typeof ageItem>;

export interface AgeForm {
  items: AgeItem[];
}

export const ageTranslations: Record<string, string> = {
  '12': '0 t/m 12',
  '14': '13 t/m 14',
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
  isJeugd?: boolean;
}

interface TranslateClassProps {
  gender: Gender;
  boatType: BoatType;
  className: string;
  isJeugdWedstrijd: boolean;
}

export function translateClass({
  gender,
  boatType,
  className,
  isJeugdWedstrijd,
}: TranslateClassProps) {
  const translatedGender = translateGenderToShort(gender, isJeugdWedstrijd);
  return className;
}

export const saveSettingsSchema = z.object({
  type: z.enum(['boats', 'ages', 'classes', 'general']),
  itemsToSave: z.union([
    z.array(ageItem),
    z.array(boatItemForm),
    z.array(classItem),
  ]),
});
export type SaveSettingsSchema = z.infer<typeof saveSettingsSchema>;

export const saveGeneralSettingsSchema = z.object({
  date: z.string().optional(),
  missingNumbers: z.array(z.number().min(1)).optional(),
  isJeugd: z.boolean().optional(),
});
export type SaveGeneralSettings = z.infer<typeof saveGeneralSettingsSchema>;

interface GetClassItemProps {
  age: AgeType;
  boatType: BoatType;
  gender: Gender;
  isJeugdWedstrijd: boolean;
}

export function getClassItem({
  age,
  boatType,
  gender,
  isJeugdWedstrijd,
}: GetClassItemProps): ClassItem {
  const translatedGender = translateGenderToShort(gender, isJeugdWedstrijd);
  const name = `${translatedGender}${age} ${boatType}`;

  return {
    ages: [age],
    boatType,
    gender,
    name,
  };
}
