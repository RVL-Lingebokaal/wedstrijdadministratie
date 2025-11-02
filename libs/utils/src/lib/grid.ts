export function getRoundedClass(
  index: number,
  length: number,
  bottom?: boolean
) {
  if (index === 0 && bottom) {
    return 'rounded-bl-xl';
  } else if (index === 0) {
    return 'rounded-tl-xl';
  } else if (index === length - 1 && bottom) {
    return 'rounded-br-xl';
  } else if (index === length - 1) {
    return 'rounded-tr-xl';
  }
  return '';
}
export const colsOptions: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
};
