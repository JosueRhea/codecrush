export const sumArrayUntilIndex = (numbers, index) =>
  numbers.slice(0, index).reduce((total, num) => total + num, 0);
