import { Boat, Participant } from '@models';

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
    throw new Error('This block is already taken');
  }
  object.blocks.add(block);
  return object;
}
