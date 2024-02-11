export interface Boat {
  name: string;
  club: string;
  id: string;
  blocks: Set<number>;
}

export function getBoatId(name: string, club: string) {
  return name.substring(0, 3) + club.substring(0, 3);
}
