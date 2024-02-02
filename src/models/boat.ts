export interface Boat {
  name: string;
  club: string;
  id: string;
  blocks: Set<number>;
}

interface AddBlockToBoatProps {
  boat: Boat;
  block: number;
  reset?: boolean;
}

export function addBlockToBoat({ reset, boat, block }: AddBlockToBoatProps) {
  if (!reset && boat.blocks.has(block)) {
    throw new Error("This block is already taken");
  }
  boat.blocks.add(block);
  return boat;
}

interface UpdateBlocksOfBoatProps {
  boat: Boat;
  toRemove: number;
  toAdd: number;
  reset?: boolean;
}

export function updateBlocksOfBoat({
  boat,
  toAdd,
  reset,
  toRemove,
}: UpdateBlocksOfBoatProps) {
  boat = addBlockToBoat({ reset, boat, block: toAdd });
  boat.blocks.delete(toRemove);

  return boat;
}

export function getBoatId(name: string, club: string) {
  return name.substring(0, 3) + club.substring(0, 3);
}
