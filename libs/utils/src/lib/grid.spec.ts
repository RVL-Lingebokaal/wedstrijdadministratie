import { getRoundedClass } from './grid';

describe('grid', () => {
  describe(getRoundedClass.name, () => {
    it.each([
      { index: 0, length: 1, bottom: true, expected: 'rounded-bl-xl' },
      { index: 0, length: 1, bottom: false, expected: 'rounded-tl-xl' },
      { index: 1, length: 2, bottom: true, expected: 'rounded-br-xl' },
      { index: 1, length: 2, bottom: false, expected: 'rounded-tr-xl' },
      { index: 1, length: 3, bottom: true, expected: '' },
    ])('returns the correct class', ({ index, length, bottom, expected }) => {
      expect(getRoundedClass(index, length, bottom)).toEqual(expected);
    });
  });
});
