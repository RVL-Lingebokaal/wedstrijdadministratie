export const sessie = ['all', 'sessie1', 'sessie2', 'sessie3'] as const;
export type Sessie = (typeof sessie)[number];
