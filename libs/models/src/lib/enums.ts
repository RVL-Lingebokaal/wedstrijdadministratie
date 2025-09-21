export const administrationTabs = [
  'class',
  'session',
  'startNumbers',
  'statistics',
  'downloads',
] as const;
export type AdministrationTabs = (typeof administrationTabs)[number];

export const settingsTabs = [
  'type',
  'leeftijd',
  'ploeg',
  'instellingen',
  'gebruikers',
] as const;
export type SettingsTabs = (typeof settingsTabs)[number];
