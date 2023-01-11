export const sumArrayUntilIndex = (numbers, index) =>
  numbers.slice(0, index).reduce((total, num) => total + num, 0);

export function sumRange(arr, start, end) {  
  let total = 0;
  for (let i = start; i < end; i++) {
    total += arr[i];
  }  
  return total;
}

export function insertInto(array, index, element) {
  return array.slice(0, index).concat(element, array.slice(index));
}
