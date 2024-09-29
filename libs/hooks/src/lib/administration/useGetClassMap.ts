import { ClassItem, Settings } from '@models';
import { useMemo } from 'react';

export function useGetClassMap(settingsData?: Omit<Settings, 'general'>) {
  return useMemo(() => {
    const map = new Map<string, ClassItem[]>();
    if (settingsData?.classes === null || settingsData?.classes.length === 0) {
      return map;
    }
    return (
      settingsData?.classes.reduce((acc, c) => {
        const key = JSON.stringify({ gender: c.gender, boat: c.boatType });
        let arr: ClassItem[] = [];
        if (acc.has(key)) {
          arr = acc.get(key) ?? [];
        }

        arr.push(c);
        acc.set(key, arr);
        return acc;
      }, map) ?? map
    );
  }, [settingsData?.classes]);
}
