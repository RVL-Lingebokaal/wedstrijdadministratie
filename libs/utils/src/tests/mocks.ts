import {
  AgeItem,
  AgeStrategy,
  AgeType,
  BoatItem,
  BoatType,
  ClassItem,
  Gender,
  Participant,
} from '@models';
import { GetTeamResult } from '@hooks';

export const allAges: AgeItem[] = [
  {
    correctionFemale: 0.806,
    age: '0 t/m 14',
    strategy: AgeStrategy.average,
    type: AgeType.fourteen,
    correctionMale: 0.895,
  },
  {
    age: '15 t/m 16',
    strategy: AgeStrategy.average,
    type: AgeType.sixteen,
    correctionMale: 0.945,
    correctionFemale: 0.85,
  },
  {
    age: '17 t/m 18',
    correctionFemale: 0.871,
    correctionMale: 0.968,
    type: AgeType.eighteen,
    strategy: AgeStrategy.average,
  },
  {
    correctionMale: 1,
    age: '0 t/m 26',
    strategy: AgeStrategy.average,
    correctionFemale: 0.9,
    type: AgeType.open,
  },
  {
    type: AgeType.VA,
    age: '27 t/m 35',
    correctionMale: 0.991,
    correctionFemale: 0.892,
    strategy: AgeStrategy.average,
  },
  {
    type: AgeType.VB,
    strategy: AgeStrategy.average,
    age: '36 t/m 42',
    correctionMale: 0.979,
    correctionFemale: 0.881,
  },
  {
    correctionFemale: 0.866,
    age: '43 t/m 49',
    correctionMale: 0.962,
    type: AgeType.VC,
    strategy: AgeStrategy.average,
  },
  {
    strategy: AgeStrategy.average,
    type: AgeType.VD,
    correctionMale: 0.944,
    age: '50 t/m 54',
    correctionFemale: 0.85,
  },
  {
    type: AgeType.VE,
    correctionFemale: 0.836,
    correctionMale: 0.929,
    age: '55 t/m 59',
    strategy: AgeStrategy.average,
  },
  {
    age: '60 t/m 64',
    type: AgeType.VF,
    correctionMale: 0.912,
    strategy: AgeStrategy.average,
    correctionFemale: 0.821,
  },
  {
    age: '65 t/m 69',
    correctionFemale: 0.8,
    type: AgeType.VG,
    correctionMale: 0.889,
    strategy: AgeStrategy.average,
  },
  {
    age: '70 t/m 74',
    correctionFemale: 0.769,
    correctionMale: 0.854,
    type: AgeType.VH,
    strategy: AgeStrategy.average,
  },
  {
    correctionMale: 0.802,
    age: '75 t/m 79',
    strategy: AgeStrategy.average,
    type: AgeType.VI,
    correctionFemale: 0.721,
  },
  {
    correctionMale: 0.746,
    strategy: AgeStrategy.average,
    age: '80 t/m 84',
    correctionFemale: 0.671,
    type: AgeType.VJ,
  },
  {
    correctionFemale: 0.628,
    correctionMale: 0.698,
    type: AgeType.VK,
    strategy: AgeStrategy.average,
    age: '85 t/m 120',
  },
];

export const boatItems = [
  { price: '20', type: BoatType.scullFourWith, correction: 1.13 },
  { correction: 1.164, type: BoatType.scullFourWithout, price: 10 },
  { type: BoatType.scullFourWithC, correction: 1.076, price: 10 },
  { type: BoatType.boardFourWithC, price: 10, correction: 1.035 },
  { correction: 1.122, type: BoatType.boardFourWithout, price: 10 },
  { type: BoatType.boardFourWith, correction: 1.094, price: 10 },
  { type: BoatType.scullEightWith, price: 10, correction: 1.244 },
  { type: BoatType.boardEightWith, price: 10, correction: 1.206 },
  { type: BoatType.boardTwoWithout, correction: 1.039, price: 10 },
  { correction: 1.076, type: BoatType.scullTwoWithout, price: 10 },
  { correction: 1, price: 10, type: BoatType.skiff },
] as BoatItem[];

export const teams = [
  {
    participants: [
      { birthYear: new Date().getFullYear() - 13, ageType: AgeType.fourteen },
    ] as Participant[],
    gender: Gender.M,
    boatType: BoatType.skiff,
    result: {
      finishTimeA: '631188002000',
      finishTimeB: '631188003000',
      startTimeA: '631184400000',
      startTimeB: '631184401000',
    },
  },
  {
    participants: [
      { birthYear: new Date().getFullYear() - 16, ageType: AgeType.sixteen },
      { birthYear: new Date().getFullYear() - 18, ageType: AgeType.eighteen },
    ] as Participant[],
    gender: Gender.F,
    boatType: BoatType.boardTwoWithout,
    result: {
      finishTimeA: '631188003000',
      finishTimeB: '631188003000',
      startTimeA: '631184409000',
      startTimeB: '631184408000',
    },
  },
  {
    participants: [
      { birthYear: new Date().getFullYear() - 18, ageType: AgeType.eighteen },
      { birthYear: new Date().getFullYear() - 20, ageType: AgeType.open },
      { birthYear: new Date().getFullYear() - 36, ageType: AgeType.VB },
      { birthYear: new Date().getFullYear() - 46, ageType: AgeType.VC },
    ] as Participant[],
    gender: Gender.MIX,
    boatType: BoatType.boardFourWithout,
    result: {
      finishTimeA: '631188036000',
      finishTimeB: '631188035000',
      startTimeA: '631184458000',
      startTimeB: '631184456000',
    },
  },
] as GetTeamResult[];

export const classItems = [
  {
    ages: [AgeType.eighteen, AgeType.sixteen, AgeType.fourteen],
    gender: Gender.F,
    boatType: BoatType.boardTwoWithout,
    name: 'Dames dub',
  },
  {
    ages: [AgeType.open, AgeType.VB, AgeType.VC],
    gender: Gender.MIX,
    boatType: BoatType.boardFourWithout,
    name: 'Mix 4*',
  },
  {
    ages: [AgeType.eighteen, AgeType.sixteen, AgeType.fourteen],
    gender: Gender.M,
    boatType: BoatType.skiff,
    name: 'Heren skiff',
  },
] as ClassItem[];
