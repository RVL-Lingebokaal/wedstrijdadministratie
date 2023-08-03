export function getRoundedClass(
  index: number,
  length: number,
  bottom?: boolean
) {
  if (index === 0 && bottom) {
    return "rounded-bl-xl";
  } else if (index === 0) {
    return "rounded-tl-xl";
  } else if (index === length - 1 && bottom) {
    return "rounded-br-xl";
  } else if (index === length - 1) {
    return "rounded-tr-xl";
  }
  return "";
}
