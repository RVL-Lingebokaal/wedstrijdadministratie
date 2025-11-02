export const administrationTabs = [
  'class',
  'session',
  'startNumbers',
  'statistics',
  'downloads',
  'corrections',
] as const;
export type AdministrationTabs = (typeof administrationTabs)[number];
export const administrationTabsTranslated: {
  value: AdministrationTabs;
  name: string;
}[] = [
  { value: 'class', name: 'Klassen' },
  { value: 'session', name: 'Sessies' },
  { value: 'startNumbers', name: 'Startnummers' },
  { value: 'statistics', name: 'Statistieken' },
  { value: 'downloads', name: 'Downloads' },
  { value: 'corrections', name: 'Resultaten correcties' },
];

export const settingsTabs = ['type', 'leeftijd', 'instellingen'] as const;
export type SettingsTabs = (typeof settingsTabs)[number];
export const settingsTabsTranslated: { value: SettingsTabs; name: string }[] = [
  { value: 'type', name: 'Correctiefactoren' },
  { value: 'leeftijd', name: 'Leeftijden' },
  { value: 'instellingen', name: 'Instellingen' },
];
