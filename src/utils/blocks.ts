import { Boat } from "../models/boat";
import { Participant } from "../models/participant";

export function stringifySet(set: Set<number>) {
  return JSON.stringify(Array.from(set.values()));
}

type BlockNarrowing = Boat | Participant;

interface AddBlockProps<T extends BlockNarrowing> {
  object: T;
  block: number;
  reset?: boolean;
}

export function addBlock<T extends BlockNarrowing>({
  reset,
  object,
  block,
}: AddBlockProps<T>) {
  if (!reset && object.blocks.has(block)) {
    throw new Error("This block is already taken");
  }
  object.blocks.add(block);
  return object;
}

interface UpdateBlocksProps<T extends BlockNarrowing> {
  object: T;
  toRemove: number;
  toAdd: number;
  reset?: boolean;
}

export function updateBlocks<T extends BlockNarrowing>({
  object,
  toAdd,
  reset,
  toRemove,
}: UpdateBlocksProps<T>) {
  object = addBlock<T>({ reset, object, block: toAdd });
  object.blocks.delete(toRemove);

  return object;
}
