import { addBlock, stringifySet } from './blocks';
import { Boat } from '@models';

describe('blocks', () => {
  describe(stringifySet.name, () => {
    it('stringifies a a set of numbers', () => {
      const set = new Set([1, 2, 3]);

      expect(stringifySet(set)).toEqual('[1,2,3]');
    });
  });

  describe(addBlock.name, () => {
    it('adds a block', () => {
      const object = { blocks: new Set<number>() } as Boat;
      const block = 1;

      const result = addBlock({ object, block });

      expect(result.blocks.has(block)).toEqual(true);
    });

    it('adds an existing block while reset is true', () => {
      const object = { blocks: new Set<number>([1]) } as Boat;
      const block = 1;

      const result = addBlock({ object, block, reset: true });

      expect(result.blocks.has(block)).toEqual(true);
    });

    it('throws an error when adding an existing block', () => {
      const object = { blocks: new Set<number>([1]) } as Boat;
      const block = 1;

      return expect(() => addBlock({ object, block })).toThrowError(
        'This block is already taken'
      );
    });
  });
});
